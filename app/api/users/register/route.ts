import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { createUser, createWallet, createReferral, getUserByEmail } from "@/lib/db"
import { generateReferralCode } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, username, referralCode } = body

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Handle referral
    const referredBy = null
    if (referralCode) {
      // You'd need to implement getUserByReferralCode function
      // For now, we'll skip this validation
    }

    // Create user
    const user = await createUser({
      name,
      email,
      password: hashedPassword,
      username,
      referralCode: generateReferralCode(),
      referredBy,
    })

    // Create wallet
    await createWallet(user.id)

    // Create referral record if applicable
    if (referredBy) {
      await createReferral(referredBy, user.id)
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
