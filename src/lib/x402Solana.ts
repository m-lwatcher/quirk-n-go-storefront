import { Connection, PublicKey, Transaction } from '@solana/web3.js'
import { createAssociatedTokenAccountInstruction, createTransferCheckedInstruction, getAssociatedTokenAddress } from '@solana/spl-token'
import { Buffer } from 'buffer'
import type { SolanaProvider } from '../context/WalletContext'

export type LegacySolanaPaymentRequest = {
  max_amount_required: string
  asset_type: string
  asset_address: string
  payment_address: string
  network: string
  expires_at: string
  nonce: string
  payment_id: string
  resource: string
  description?: string
}

const RPC_BY_NETWORK: Record<string, string> = {
  'solana-mainnet': 'https://api.mainnet-beta.solana.com',
  'solana-devnet': 'https://api.devnet.solana.com',
  'solana-testnet': 'https://api.testnet.solana.com',
}

const DECIMALS_BY_MINT: Record<string, number> = {
  // USDC on Solana mainnet
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: 6,
}

function amountToUnits(amount: string, decimals: number): bigint {
  const clean = String(amount).trim()
  const [whole = '0', fraction = ''] = clean.split('.')
  const padded = (fraction + '0'.repeat(decimals)).slice(0, decimals)
  return BigInt(whole || '0') * (10n ** BigInt(decimals)) + BigInt(padded || '0')
}

function encodeAuthorization(data: Record<string, unknown>) {
  return Buffer.from(JSON.stringify(data), 'utf8').toString('base64')
}

export function isLegacySolanaPaymentRequest(value: any): value is LegacySolanaPaymentRequest {
  return Boolean(
    value &&
    value.network?.startsWith?.('solana-') &&
    value.asset_type === 'SPL' &&
    value.payment_id &&
    value.payment_address &&
    value.asset_address &&
    value.max_amount_required
  )
}

export async function buildSolanaPaymentAuthorization(request: LegacySolanaPaymentRequest, provider: SolanaProvider) {
  if (!provider.publicKey?.toString) throw new Error('Solana wallet is not connected')
  if (!provider.signAndSendTransaction && !provider.signTransaction) {
    throw new Error('Connected Solana wallet cannot sign transactions')
  }

  const payer = new PublicKey(provider.publicKey.toString())
  const recipient = new PublicKey(request.payment_address)
  const mint = new PublicKey(request.asset_address)
  const decimals = DECIMALS_BY_MINT[request.asset_address] ?? 6
  const units = amountToUnits(request.max_amount_required, decimals)

  const rpcUrl = RPC_BY_NETWORK[request.network] || RPC_BY_NETWORK['solana-devnet']
  const connection = new Connection(rpcUrl, 'confirmed')

  const fromAta = await getAssociatedTokenAddress(mint, payer)
  const toAta = await getAssociatedTokenAddress(mint, recipient)
  const latest = await connection.getLatestBlockhash('confirmed')

  const transaction = new Transaction({
    feePayer: payer,
    recentBlockhash: latest.blockhash,
  })

  const recipientTokenAccount = await connection.getAccountInfo(toAta, 'confirmed')
  if (!recipientTokenAccount) {
    transaction.add(createAssociatedTokenAccountInstruction(payer, toAta, recipient, mint))
  }

  transaction.add(
    createTransferCheckedInstruction(
      fromAta,
      mint,
      toAta,
      payer,
      units,
      decimals,
    )
  )

  let signature: string | undefined
  if (provider.signAndSendTransaction) {
    const result = await provider.signAndSendTransaction(transaction)
    signature = typeof result === 'string' ? result : result?.signature
  } else if (provider.signTransaction) {
    const signed = await provider.signTransaction(transaction)
    signature = await connection.sendRawTransaction(signed.serialize(), { skipPreflight: false })
  }

  if (!signature) throw new Error('Wallet did not return a Solana transaction signature')

  try {
    await connection.confirmTransaction({ signature, blockhash: latest.blockhash, lastValidBlockHeight: latest.lastValidBlockHeight }, 'confirmed')
  } catch {
    // Some wallet/mobile flows return a signature before the RPC can confirm it. The endpoint retry is the real access check.
  }

  const authorization = {
    payment_id: request.payment_id,
    actual_amount: request.max_amount_required,
    payment_address: request.payment_address,
    asset_address: request.asset_address,
    network: request.network,
    timestamp: new Date().toISOString(),
    signature,
    public_key: payer.toString(),
    transaction_hash: signature,
  }

  return {
    authorization,
    header: encodeAuthorization(authorization),
    signature,
  }
}
