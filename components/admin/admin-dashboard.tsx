"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AdminSidebar } from "./admin-sidebar"
import { UsersManagement } from "./users-management"
import { ListingsManagement } from "./listings-management"
import { TransactionsManagement } from "./transactions-management"
import { SettingsManagement } from "./settings-management"
import { WithdrawalsManagement } from "./withdrawals-management"
import { AnalyticsDashboard } from "./analytics-dashboard"
import { Users, FileText, DollarSign, ShoppingBag, AlertTriangle } from "lucide-react"

interface AdminDashboardProps {
  stats: {
    totalUsers: number
    totalListings: number
    totalTransactions: number
    totalRevenue: number
    pendingListings: number
    pendingWithdrawals: number
    activeUsers: number
    conversionRate: number
  }
}

export function AdminDashboard({ stats }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const overviewStats = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      description: `${stats.activeUsers} active this month`,
      trend: "+12%",
    },
    {
      title: "Total Listings",
      value: stats.totalListings.toLocaleString(),
      icon: FileText,
      description: `${stats.pendingListings} pending approval`,
      trend: "+8%",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: "Platform commission earned",
      trend: "+23%",
    },
    {
      title: "Transactions",
      value: stats.totalTransactions.toLocaleString(),
      icon: ShoppingBag,
      description: `${stats.conversionRate}% conversion rate`,
      trend: "+15%",
    },
  ]

  const alerts = [
    {
      type: "warning",
      message: `${stats.pendingListings} listings awaiting approval`,
      action: "Review Listings",
    },
    {
      type: "info",
      message: `${stats.pendingWithdrawals} withdrawal requests pending`,
      action: "Process Withdrawals",
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your WhatsApp marketplace</p>
          </div>

          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Alerts */}
              {alerts.length > 0 && (
                <div className="grid gap-4">
                  {alerts.map((alert, index) => (
                    <Card key={index} className="border-l-4 border-l-yellow-500">
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-5 w-5 text-yellow-500" />
                          <span>{alert.message}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          {alert.action}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {overviewStats.map((stat, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-muted-foreground">{stat.description}</p>
                        <Badge variant="secondary" className="text-green-600">
                          {stat.trend}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <AnalyticsDashboard />
            </div>
          )}

          {activeTab === "users" && <UsersManagement />}
          {activeTab === "listings" && <ListingsManagement />}
          {activeTab === "transactions" && <TransactionsManagement />}
          {activeTab === "withdrawals" && <WithdrawalsManagement />}
          {activeTab === "settings" && <SettingsManagement />}
        </div>
      </div>
    </div>
  )
}
