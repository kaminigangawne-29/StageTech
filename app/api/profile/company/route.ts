import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.productionCompany.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Company profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("[GET /api/profile/company]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { companyName, description, website, logoUrl, location } = body;

    const existingProfile = await prisma.productionCompany.findUnique({
      where: { userId: session.user.id },
    });

    let profile;
    if (existingProfile) {
      profile = await prisma.productionCompany.update({
        where: { userId: session.user.id },
        data: {
          ...(companyName !== undefined && { companyName }),
          ...(description !== undefined && { description }),
          ...(website !== undefined && { website }),
          ...(logoUrl !== undefined && { logoUrl }),
          ...(location !== undefined && { location }),
        },
      });
    } else {
      profile = await prisma.productionCompany.create({
        data: {
          userId: session.user.id,
          companyName: companyName ?? "",
          description,
          website,
          logoUrl,
          location,
        },
      });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("[PUT /api/profile/company]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
