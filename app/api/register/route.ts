import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Salt rounds for bcrypt – 10 is the recommended production default.
const SALT_ROUNDS = 10;

interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  role: "TECHNICIAN" | "PRODUCTION";
}

export async function POST(request: NextRequest) {
  try {
    // ── 1. Parse & validate body ───────────────────────────────────────
    let body: RegisterRequestBody;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body." },
        { status: 400 }
      );
    }

    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "name, email, password, and role are all required." },
        { status: 400 }
      );
    }

    if (role !== "TECHNICIAN" && role !== "PRODUCTION") {
      return NextResponse.json(
        { error: "role must be either TECHNICIAN or PRODUCTION." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // ── 2. Check for existing account ─────────────────────────────────
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // ── 3. Hash password ───────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // ── 4. Create user + role-specific profile in a transaction ────────
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: name.trim(),
          email: normalizedEmail,
          password: hashedPassword,
          role,
        },
      });

      if (role === "TECHNICIAN") {
        await tx.technicianProfile.create({
          data: {
            userId: user.id,
            fullName: name.trim(),
            availabilityStatus: "AVAILABLE",
          },
        });
      } else if (role === "PRODUCTION") {
        await tx.productionCompany.create({
          data: {
            userId: user.id,
            companyName: name.trim(),
          },
        });
      }

      return user;
    });

    // ── 5. Return user without the hashed password ─────────────────────
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _omitted, ...safeUser } = newUser;

    return NextResponse.json(
      { message: "Account created successfully.", user: safeUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/register] Unexpected error:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
