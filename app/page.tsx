'use client'

import { useEffect, useState } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, TrendingUp, Clock, DollarSign } from 'lucide-react'
import { PREDICT_MARKET_ABI, CONTRACT_ADDRESSES, type Market } from '@/lib/contract'
import { CreateMarketDialog } from '@/components/create-market-dialog'
import { toast } from 'sonner'

export default function Home() {
  const { address, chainId, isConnected } = useAccount()
  const [selectedMarket, setSelectedMarket] = useState<number | null>(null)
  const [betAmount, setBetAmount] = useState('0.01')

  const contractAddress = chainId ? CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES] : undefined

  const { data: markets, isLoading, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: PREDICT_MARKET_ABI,
    functionName: 'getActiveMarkets',
    query: {
      enabled: !!contractAddress && isConnected
    }
  })

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    if (isSuccess) {
      toast.success('Bet placed successfully!')
      refetch()
      setSelectedMarket(null)
    }
  }, [isSuccess, refetch])

  const handleBet = (marketId: number, choice: boolean) => {
    if (!contractAddress) {
      toast.error('Please connect to Base network')
      return
    }

    writeContract({
      address: contractAddress as `0x${string}`,
      abi: PREDICT_MARKET_ABI,
      functionName: 'bet',
      args: [BigInt(marketId), choice],
      value: parseEther(betAmount)
    })
  }

  const calculateOdds = (yesAmount: bigint, noAmount: bigint, choice: boolean) => {
    const yes = Number(formatEther(yesAmount))
    const no = Number(formatEther(noAmount))
    const total = yes + no
    
    if (total === 0) return '50%'
    
    const percentage = choice ? (yes / total) * 100 : (no / total) * 100
    return `${percentage.toFixed(1)}%`
  }

  const formatTimeRemaining = (endTime: bigint) => {
    const now = Math.floor(Date.now() / 1000)
    const end = Number(endTime)
    const diff = end - now

    if (diff <= 0) return 'Ended'

    const days = Math.floor(diff / 86400)
    const hours = Math.floor((diff % 86400) / 3600)
    const minutes = Math.floor((diff % 3600) / 60)

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-900/50 border-slate-800 backdrop-blur">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
            <CardTitle className="text-2xl text-white">Welcome to Predict Base</CardTitle>
            <CardDescription className="text-slate-400">
              Connect your wallet to start predicting on Base network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <appkit-button />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <nav className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Predict Base</h1>
            <Badge variant="secondary" className="ml-2 bg-blue-500/20 text-blue-300 border-blue-500/30">
              {chainId === 8453 ? 'Mainnet' : 'Testnet'}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <CreateMarketDialog onSuccess={refetch} />
            <appkit-button />
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : !markets || markets.length === 0 ? (
          <Card className="max-w-md mx-auto bg-slate-900/50 border-slate-800">
            <CardHeader className="text-center">
              <CardTitle className="text-white">No Active Markets</CardTitle>
              <CardDescription className="text-slate-400">
                Create the first prediction market to get started
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(markets as Market[]).map((market) => {
              const totalPool = market.yesAmount + market.noAmount
              const yesPercentage = calculateOdds(market.yesAmount, market.noAmount, true)
              const noPercentage = calculateOdds(market.yesAmount, market.noAmount, false)

              return (
                <Card key={Number(market.id)} className="bg-slate-900/50 border-slate-800 hover:border-blue-500/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <CardTitle className="text-lg text-white leading-tight">
                        {market.question}
                      </CardTitle>
                      <Badge variant="outline" className="border-slate-700 text-slate-300 shrink-0">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTimeRemaining(market.endTime)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <DollarSign className="w-4 h-4" />
                      <span>Pool: {formatEther(totalPool)} ETH</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                        <div className="text-xs text-green-300 mb-1">Yes</div>
                        <div className="text-2xl font-bold text-green-400">{yesPercentage}</div>
                        <div className="text-xs text-slate-400 mt-1">
                          {formatEther(market.yesAmount)} ETH
                        </div>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                        <div className="text-xs text-red-300 mb-1">No</div>
                        <div className="text-2xl font-bold text-red-400">{noPercentage}</div>
                        <div className="text-xs text-slate-400 mt-1">
                          {formatEther(market.noAmount)} ETH
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <Button
                        onClick={() => handleBet(Number(market.id), true)}
                        disabled={isPending || isConfirming}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {isPending || isConfirming ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Bet Yes'
                        )}
                      </Button>
                      <Button
                        onClick={() => handleBet(Number(market.id), false)}
                        disabled={isPending || isConfirming}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {isPending || isConfirming ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Bet No'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
