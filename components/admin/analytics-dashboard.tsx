import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AnalyticsDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        {/* TODO – charts & KPIs */}
        <p className="text-muted-foreground">Analytics widgets coming soon 🚧</p>
      </CardContent>
    </Card>
  )
}
