import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getWalletByUserId, createWithdrawalRequest } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount } = await request.json()

    if (!amount || amount < 50) {
      return NextResponse.json({ error: "Minimum withdrawal amount is $50" }, { status: 400 })
    }

    const wallet = await getWalletByUserId(session.user.id)

    if (!wallet || wallet.balance < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    const withdrawalRequest = await createWithdrawalRequest(session.user.id, amount)

    return NextResponse.json({
      success: true,
      withdrawalId: withdrawalRequest.id,
      message: "Withdrawal request submitted successfully",
    })
  } catch (error) {
    console.error("Withdrawal error:", error)
    return NextResponse.json({ error: "Failed to process withdrawal" }, { status: 500 })
  }
}
