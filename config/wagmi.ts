import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// 1. Get projectId from https://cloud.reown.com
export const projectId = '8b0afcaf99464b72fe69705db84248f0'

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// 2. Set up Wagmi adapter
export const networks = [base, baseSepolia]

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
})

// 3. Create modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata: {
    name: 'Predict Base',
    description: 'Decentralized Prediction Market on Base',
    url: 'https://predict-base.vercel.app',
    icons: ['https://avatars.githubusercontent.com/u/179229932']
  },
  features: {
    analytics: true,
    email: false,
    socials: []
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#0052FF',
    '--w3m-border-radius-master': '2px'
  }
})

export const config = wagmiAdapter.wagmiConfig
