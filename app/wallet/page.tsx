import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getUserById, getWalletByUserId, getWalletTransactions } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice, formatDate } from "@/lib/utils"
import { WithdrawForm } from "@/components/wallet/withdraw-form"
import { DepositForm } from "@/components/wallet/deposit-form"
import { Wallet, TrendingUp, TrendingDown, Clock, CheckCircle } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Wallet - WhatsApp Market",
  description: "Manage your wallet, view transactions, and withdraw earnings",
}

export default async function WalletPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const [user, wallet, transactions] = await Promise.all([
    getUserById(session.user.id),
    getWalletByUserId(session.user.id),
    getWalletTransactions(session.user.id, 20),
  ])

  if (!user) {
    redirect("/auth/signin")
  }

  const balance = wallet?.balance || 0
  const pendingWithdrawals = transactions.filter((t) => t.type === "WITHDRAWAL" && t.status === "PENDING")
  const totalPending = pendingWithdrawals.reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Wallet</h1>
        <p className="text-muted-foreground">Manage your earnings and transactions</p>
      </div>

      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatPrice(balance)}</div>
            <p className="text-xs text-muted-foreground">Ready for withdrawal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Withdrawals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatPrice(totalPending)}</div>
            <p className="text-xs text-muted-foreground">{pendingWithdrawals.length} pending requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatPrice(balance + totalPending)}</div>
            <p className="text-xs text-muted-foreground">Lifetime earnings</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Actions */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your wallet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <WithdrawForm balance={balance} />
              <DepositForm />
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Your recent wallet activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-full bg-muted">
                          {transaction.type === "DEPOSIT" && <TrendingUp className="h-4 w-4 text-green-600" />}
                          {transaction.type === "WITHDRAWAL" && <TrendingDown className="h-4 w-4 text-red-600" />}
                          {transaction.type === "SALE" && <CheckCircle className="h-4 w-4 text-blue-600" />}
                          {transaction.type === "REFERRAL" && <TrendingUp className="h-4 w-4 text-purple-600" />}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(transaction.created_at)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold ${
                            transaction.type === "DEPOSIT" ||
                            transaction.type === "SALE" ||
                            transaction.type === "REFERRAL"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "WITHDRAWAL" ? "-" : "+"}
                          {formatPrice(transaction.amount)}
                        </p>
                        <Badge
                          variant={
                            transaction.status === "COMPLETED"
                              ? "default"
                              : transaction.status === "PENDING"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No transactions yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
