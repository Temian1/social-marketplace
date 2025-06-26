"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { formatPrice } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface WithdrawFormProps {
  balance: number
}

export function WithdrawForm({ balance }: WithdrawFormProps) {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const minWithdrawal = 50 // This should come from settings

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const withdrawAmount = Number.parseFloat(amount)

    if (withdrawAmount < minWithdrawal) {
      setError(`Minimum withdrawal amount is ${formatPrice(minWithdrawal)}`)
      setIsLoading(false)
      return
    }

    if (withdrawAmount > balance) {
      setError("Insufficient balance")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/wallet/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: withdrawAmount }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to process withdrawal")
      } else {
        toast({
          title: "Withdrawal Requested",
          description: "Your withdrawal request has been submitted for review",
        })
        setAmount("")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="amount">Withdrawal Amount</Label>
        <Input
          id="amount"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min={minWithdrawal}
          max={balance}
          step="0.01"
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          Available: {formatPrice(balance)} | Min: {formatPrice(minWithdrawal)}
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={isLoading || balance < minWithdrawal}>
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            Processing...
          </>
        ) : (
          "Request Withdrawal"
        )}
      </Button>
    </form>
  )
}
