# 🎯 Predict Base

A decentralized prediction market dApp **built on Base** blockchain. Create markets, place bets, and win rewards based on real-world outcomes.

![Built on Base](https://img.shields.io/badge/Built%20on-Base-0052FF?style=for-the-badge&logo=ethereum)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## 🌟 Features

- ✨ **Create Prediction Markets** - Anyone can create markets with custom questions and end times
- 💰 **Place Bets** - Bet on YES or NO outcomes with ETH
- 🏆 **Win Rewards** - Winners share the losing pool proportionally
- 🔗 **Multi-Network Support** - Works on both Base Mainnet and Base Sepolia testnet
- 🎨 **Modern UI** - Dark theme with Tailwind CSS and Shadcn UI
- 🔐 **Secure Wallet Connection** - Powered by Reown AppKit (formerly WalletConnect)

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI Components
- **Blockchain**: Base (Mainnet & Sepolia), Solidity ^0.8.20
- **Web3 Libraries**: 
  - Wagmi v2 - React hooks for Ethereum
  - Viem - TypeScript Interface for Ethereum
  - Reown AppKit - Wallet connection UI
- **State Management**: TanStack Query (React Query)
- **Notifications**: Sonner

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Web3 wallet (MetaMask, Coinbase Wallet, etc.)
- ETH on Base Sepolia testnet for testing ([get testnet ETH](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet))

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/predict-base.git
cd predict-base
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure Environment

The Reown Project ID is already configured in the code:
```
REOWN_PROJECT_ID: 8b0afcaf99464b72fe69705db84248f0
```

### 4. Deploy Smart Contract

#### Using Remix IDE (Recommended for beginners)

1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create a new file `PredictMarket.sol` and paste the contract code from `contracts/PredictMarket.sol`
3. Compile the contract (Solidity 0.8.20)
4. Deploy using "Injected Provider - MetaMask"
5. Select Base Sepolia network in MetaMask
6. Deploy the contract

#### Using Hardhat (Advanced)

```bash
# Install Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Initialize Hardhat project
npx hardhat init

# Copy PredictMarket.sol to contracts/
# Configure hardhat.config.ts with Base networks

# Compile
npx hardhat compile

# Deploy to Base Sepolia
npx hardhat run scripts/deploy.ts --network base-sepolia
```

### 5. Update Contract Address

After deployment, update the contract address in `lib/contract.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  // Base Mainnet
  8453: '0xYourMainnetContractAddress',
  // Base Sepolia Testnet
  84532: '0xYourSepoliaContractAddress'
} as const
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Smart Contract Functions

### For Users

- **`createMarket(string question, uint256 endTime)`** - Create a new prediction market
- **`bet(uint256 marketId, bool choice)`** - Place a bet (true = YES, false = NO)
- **`claimWinnings(uint256 marketId)`** - Claim winnings after market resolution

### For Market Creators

- **`resolveMarket(uint256 marketId, bool outcome)`** - Resolve market after end time

### View Functions

- **`getActiveMarkets()`** - Get all active markets
- **`getAllMarkets()`** - Get all markets
- **`getUserBet(uint256 marketId, address user)`** - Get user's bet details

## 🏗️ Project Structure

```
predict-base/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main page with market list
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # Shadcn UI components
│   └── create-market-dialog.tsx
├── config/
│   └── wagmi.ts           # Wagmi & AppKit configuration
├── context/
│   └── index.tsx          # React context provider
├── contracts/
│   └── PredictMarket.sol  # Smart contract
├── lib/
│   ├── contract.ts        # Contract ABI and addresses
│   └── utils.ts           # Utility functions
└── package.json
```

## 🌐 Network Configuration

### Base Mainnet
- **Chain ID**: 8453
- **RPC**: https://mainnet.base.org
- **Explorer**: https://basescan.org

### Base Sepolia (Testnet)
- **Chain ID**: 84532
- **RPC**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org
- **Faucet**: [Coinbase Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)

## 🎨 Customization

### Styling

The app uses Tailwind CSS with a dark theme. Customize colors in `tailwind.config.ts` and `app/globals.css`.

### Wallet Modal Theme

Customize the AppKit modal theme in `config/wagmi.ts`:

```typescript
themeMode: 'dark',
themeVariables: {
  '--w3m-accent': '#0052FF',
  '--w3m-border-radius-master': '2px'
}
```

## 🔒 Security Considerations

- ⚠️ This is a demo project for educational purposes
- Audit smart contracts before deploying to mainnet
- Use proper access controls for market resolution
- Consider implementing time locks and dispute mechanisms
- Test thoroughly on testnet before mainnet deployment

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built on [Base](https://base.org) - The secure, low-cost Ethereum L2
- Powered by [Reown](https://reown.com/) (formerly WalletConnect)
- UI components from [Shadcn UI](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

## 📞 Support

For questions and support:
- Create an issue in this repository
- Join the Base Discord community
- Follow [@base](https://twitter.com/base) on Twitter

---

**Built with ❤️ on Base**
