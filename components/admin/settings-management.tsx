import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SettingsManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Settings</CardTitle>
      </CardHeader>
      <CardContent>
        {/* TODO – toggle features, update commissions, etc. */}
        <p className="text-muted-foreground">Settings panel coming soon 🚧</p>
      </CardContent>
    </Card>
  )
}
