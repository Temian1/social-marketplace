import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getUserById, getAdminStats } from "@/lib/db"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard - WhatsApp Market",
  description: "Manage users, listings, and platform settings",
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const user = await getUserById(session.user.id)

  // Check if user is admin or has the special email
  const isAdmin = user?.is_admin || user?.email === "kikismedia@gmail.com"

  if (!isAdmin) {
    redirect("/dashboard")
  }

  const stats = await getAdminStats()

  return <AdminDashboard stats={stats} />
}
