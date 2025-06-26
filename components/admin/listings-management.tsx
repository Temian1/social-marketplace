import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ListingsManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Listings Management</CardTitle>
      </CardHeader>
      <CardContent>
        {/* TODO – approve / reject / deactivate listings */}
        <p className="text-muted-foreground">Listings moderation UI coming soon 🚧</p>
      </CardContent>
    </Card>
  )
}
