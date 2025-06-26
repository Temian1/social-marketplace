import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function WithdrawalsManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdrawals Management</CardTitle>
      </CardHeader>
      <CardContent>
        {/* TODO – approve / reject withdrawal requests */}
        <p className="text-muted-foreground">Withdrawals queue coming soon 🚧</p>
      </CardContent>
    </Card>
  )
}
