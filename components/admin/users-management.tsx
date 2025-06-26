import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function UsersManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users Management</CardTitle>
      </CardHeader>
      <CardContent>
        {/* TODO – list / search / ban / verify users */}
        <p className="text-muted-foreground">User management table coming soon 🚧</p>
      </CardContent>
    </Card>
  )
}
