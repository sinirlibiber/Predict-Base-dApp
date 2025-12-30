'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Loader2 } from 'lucide-react'
import { PREDICT_MARKET_ABI, CONTRACT_ADDRESSES } from '@/lib/contract'
import { toast } from 'sonner'

export function CreateMarketDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [endDate, setEndDate] = useState('')
  const { chainId } = useAccount()

  const contractAddress = chainId ? CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES] : undefined

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    if (isSuccess) {
      toast.success('Market created successfully!')
      setOpen(false)
      setQuestion('')
      setEndDate('')
      onSuccess()
    }
  }, [isSuccess, onSuccess])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!contractAddress) {
      toast.error('Please connect to Base network')
      return
    }

    if (!question.trim()) {
      toast.error('Please enter a question')
      return
    }

    if (!endDate) {
      toast.error('Please select an end date')
      return
    }

    const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000)
    const now = Math.floor(Date.now() / 1000)

    if (endTimestamp <= now) {
      toast.error('End date must be in the future')
      return
    }

    writeContract({
      address: contractAddress as `0x${string}`,
      abi: PREDICT_MARKET_ABI,
      functionName: 'createMarket',
      args: [question, BigInt(endTimestamp)]
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Market
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-white">Create Prediction Market</DialogTitle>
          <DialogDescription className="text-slate-400">
            Create a new market for others to predict on
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question" className="text-white">Question</Label>
            <Input
              id="question"
              placeholder="Will Bitcoin reach $100k by end of 2025?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
              disabled={isPending || isConfirming}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-white">End Date</Label>
            <Input
              id="endDate"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
              disabled={isPending || isConfirming}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isPending || isConfirming}
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isPending ? 'Confirming...' : 'Creating...'}
              </>
            ) : (
              'Create Market'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
