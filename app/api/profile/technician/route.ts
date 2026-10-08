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

    const profile = await prisma.technicianProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        skills: {
          include: {
            skill: true,
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
      return NextResponse.json(
        { error: "Technician profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("[GET /api/profile/technician]", error);
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
    const {
      fullName,
      bio,
      locationCity,
      primaryDiscipline,
      availabilityStatus,
      linkedinUrl,
      websiteUrl,
      phone,
      profileImageUrl,
      secondaryDisciplines,
    } = body;

    const existingProfile = await prisma.technicianProfile.findUnique({
      where: { userId: session.user.id },
    });

    let profile;
    if (existingProfile) {
      profile = await prisma.technicianProfile.update({
        where: { userId: session.user.id },
        data: {
          ...(fullName !== undefined && { fullName }),
          ...(bio !== undefined && { bio }),
          ...(locationCity !== undefined && { locationCity }),
          ...(primaryDiscipline !== undefined && { primaryDiscipline }),
          ...(availabilityStatus !== undefined && { availabilityStatus }),
          ...(linkedinUrl !== undefined && { linkedinUrl }),
          ...(websiteUrl !== undefined && { websiteUrl }),
          ...(phone !== undefined && { phone }),
          ...(profileImageUrl !== undefined && { profileImageUrl }),
          ...(secondaryDisciplines !== undefined && { secondaryDisciplines }),
        },
        include: {
          skills: { include: { skill: true } },
          portfolioItems: { orderBy: { sortOrder: "asc" } },
          productionHistory: { orderBy: { startDate: "desc" } },
        },
      });
    } else {
      profile = await prisma.technicianProfile.create({
        data: {
          userId: session.user.id,
          fullName: fullName ?? "",
          bio,
          locationCity,
          primaryDiscipline,
          availabilityStatus,
          linkedinUrl,
          websiteUrl,
          phone,
          profileImageUrl,
          secondaryDisciplines,
        },
        include: {
          skills: { include: { skill: true } },
          portfolioItems: { orderBy: { sortOrder: "asc" } },
          productionHistory: { orderBy: { startDate: "desc" } },
        },
      });
    }

    // Sync skills (array of skill names) if provided
    if (Array.isArray(body.skills)) {
      const names: string[] = Array.from(
        new Set(
          body.skills
            .map((s: unknown) => (typeof s === "string" ? s.trim() : ""))
            .filter(Boolean)
        )
      );
      await prisma.technicianSkill.deleteMany({
        where: { technicianId: profile.id },
      });
      for (const name of names) {
        const skill = await prisma.skill.upsert({
          where: { name },
          update: {},
          create: { name },
        });
        await prisma.technicianSkill.create({
          data: { technicianId: profile.id, skillId: skill.id },
        });
      }
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("[PUT /api/profile/technician]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
