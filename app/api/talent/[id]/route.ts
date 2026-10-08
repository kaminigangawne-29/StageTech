import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const profile = await prisma.technicianProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        skills: {
          include: {
            skill: {
              select: { id: true, name: true },
            },
          },
        },
        portfolioItems: {
          orderBy: { sortOrder: "asc" },
        },
        productionHistory: {
          orderBy: { startDate: "desc" },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const result = {
      id: profile.id,
      fullName: profile.fullName,
      bio: profile.bio,
      locationCity: profile.locationCity,
      primaryDiscipline: profile.primaryDiscipline,
      secondaryDisciplines: profile.secondaryDisciplines,
      availabilityStatus: profile.availabilityStatus,
      linkedinUrl: profile.linkedinUrl,
      websiteUrl: profile.websiteUrl,
      profileImageUrl: profile.profileImageUrl,
      user: profile.user,
      skills: profile.skills.map((ts) => ts.skill),
      portfolioItems: profile.portfolioItems,
      productionHistory: profile.productionHistory,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/talent/[id]]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
