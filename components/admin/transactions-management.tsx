import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function TransactionsManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions Management</CardTitle>
      </CardHeader>
      <CardContent>
        {/* TODO – view / refund / release escrow */}
        <p className="text-muted-foreground">Transactions dashboard coming soon 🚧</p>
      </CardContent>
    </Card>
  )
}
