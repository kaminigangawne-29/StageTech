import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const role = searchParams.get("role");
    const location = searchParams.get("location");
    const availability = searchParams.get("availability");
    const skillsParam = searchParams.get("skills");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") ?? "12", 10))
    );
    const offset = (page - 1) * limit;

    const skillNames = skillsParam
      ? skillsParam.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const where: Record<string, unknown> = {};

    if (role) {
      where.primaryDiscipline = { contains: role };
    }

    if (location) {
      where.locationCity = { contains: location };
    }

    if (availability) {
      where.availabilityStatus = availability;
    }

    if (skillNames.length > 0) {
      where.skills = {
        some: {
          skill: {
            OR: skillNames.map((n) => ({ name: { contains: n } })),
          },
        },
      };
    }

    const [total, profiles] = await Promise.all([
      prisma.technicianProfile.count({ where }),
      prisma.technicianProfile.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { fullName: "asc" },
        select: {
          id: true,
          fullName: true,
          locationCity: true,
          primaryDiscipline: true,
          availabilityStatus: true,
          profileImageUrl: true,
          skills: {
            select: {
              skill: {
                select: { id: true, name: true },
              },
            },
          },
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      }),
    ]);

    const results = profiles.map((p) => ({
      id: p.id,
      fullName: p.fullName,
      locationCity: p.locationCity,
      primaryDiscipline: p.primaryDiscipline,
      availabilityStatus: p.availabilityStatus,
      profileImageUrl: p.profileImageUrl,
      skills: p.skills.map((ts) => ts.skill),
      user: p.user,
    }));

    return NextResponse.json({
      data: results,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/talent]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
