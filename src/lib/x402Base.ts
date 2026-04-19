import { ExactEvmSchemeV1 } from '@x402/evm/v1'
import { encodePaymentSignatureHeader } from '@x402/core/http'

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<any>
}

export async function buildBasePayment(requirements: any, account: string, ethereum: EthereumProvider) {
  const signer = {
    address: account as `0x${string}`,
    signTypedData: async ({ domain, types, primaryType, message }: any) => {
      return ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [account, JSON.stringify({ domain, types, primaryType, message })],
      })
    },
  }

  const scheme = new ExactEvmSchemeV1(signer as any)
  const payload = await scheme.createPaymentPayload(1, requirements)
  const header = encodePaymentSignatureHeader(payload as any)

  return { payload, header }
}
