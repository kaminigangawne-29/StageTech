import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? "";

    const skills = await prisma.skill.findMany({
      where: {
        name: {
          contains: q,
        },
      },
      orderBy: { name: "asc" },
      take: 20,
    });

    return NextResponse.json(skills);
  } catch (error) {
    console.error("[GET /api/skills]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "TECHNICIAN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const technicianProfile = await prisma.technicianProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!technicianProfile) {
      return NextResponse.json(
        { error: "Technician profile not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Skill name is required" },
        { status: 400 }
      );
    }

    const normalizedName = name.trim();

    // Upsert the skill (create if not exists)
    const skill = await prisma.skill.upsert({
      where: { name: normalizedName },
      update: {},
      create: { name: normalizedName },
    });

    // Check if technician already has this skill
    const existing = await prisma.technicianSkill.findFirst({
      where: {
        technicianId: technicianProfile.id,
        skillId: skill.id,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Skill already added" },
        { status: 409 }
      );
    }

    const technicianSkill = await prisma.technicianSkill.create({
      data: {
        technicianId: technicianProfile.id,
        skillId: skill.id,
      },
      include: { skill: true },
    });

    return NextResponse.json(technicianSkill, { status: 201 });
  } catch (error) {
    console.error("[POST /api/skills]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "TECHNICIAN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const skillId = searchParams.get("skillId");
    if (!skillId) {
      return NextResponse.json(
        { error: "skillId query param is required" },
        { status: 400 }
      );
    }

    const technicianProfile = await prisma.technicianProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!technicianProfile) {
      return NextResponse.json(
        { error: "Technician profile not found" },
        { status: 404 }
      );
    }

    const technicianSkill = await prisma.technicianSkill.findFirst({
      where: {
        technicianId: technicianProfile.id,
        skillId,
      },
    });

    if (!technicianSkill) {
      return NextResponse.json(
        { error: "Skill not found on profile" },
        { status: 404 }
      );
    }

    await prisma.technicianSkill.delete({
      where: {
        technicianId_skillId: {
          technicianId: technicianProfile.id,
          skillId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/skills]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
