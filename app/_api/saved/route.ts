import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getCompanyProfile(userId: string) {
  return prisma.productionCompany.findUnique({ where: { userId } });
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "PRODUCTION") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const companyProfile = await getCompanyProfile(session.user.id);
    if (!companyProfile) {
      return NextResponse.json(
        { error: "Company profile not found" },
        { status: 404 }
      );
    }

    const saved = await prisma.savedTechnician.findMany({
      where: { companyId: companyProfile.id },
      include: {
        technician: {
          select: {
            id: true,
            fullName: true,
            locationCity: true,
            primaryDiscipline: true,
            availabilityStatus: true,
            profileImageUrl: true,
            skills: {
              select: {
                skill: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
      orderBy: { savedAt: "desc" },
    });

    return NextResponse.json(saved);
  } catch (error) {
    console.error("[GET /api/saved]", error);
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

    if (session.user.role !== "PRODUCTION") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const companyProfile = await getCompanyProfile(session.user.id);
    if (!companyProfile) {
      return NextResponse.json(
        { error: "Company profile not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { technicianId, listName } = body;

    if (!technicianId) {
      return NextResponse.json(
        { error: "technicianId is required" },
        { status: 400 }
      );
    }

    // Verify technician exists
    const technician = await prisma.technicianProfile.findUnique({
      where: { id: technicianId },
    });

    if (!technician) {
      return NextResponse.json(
        { error: "Technician not found" },
        { status: 404 }
      );
    }

    // Prevent duplicate saves
    const existing = await prisma.savedTechnician.findFirst({
      where: {
        companyId: companyProfile.id,
        technicianId,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Technician already saved" },
        { status: 409 }
      );
    }

    const saved = await prisma.savedTechnician.create({
      data: {
        companyId: companyProfile.id,
        technicianId,
        listName: listName ?? "Default",
      },
      include: {
        technician: {
          select: {
            id: true,
            fullName: true,
            locationCity: true,
            primaryDiscipline: true,
            availabilityStatus: true,
            profileImageUrl: true,
          },
        },
      },
    });

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("[POST /api/saved]", error);
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

    if (session.user.role !== "PRODUCTION") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Saved technician id is required" },
        { status: 400 }
      );
    }

    const companyProfile = await getCompanyProfile(session.user.id);
    if (!companyProfile) {
      return NextResponse.json(
        { error: "Company profile not found" },
        { status: 404 }
      );
    }

    const saved = await prisma.savedTechnician.findFirst({
      where: { id, companyId: companyProfile.id },
    });

    if (!saved) {
      return NextResponse.json(
        { error: "Saved technician not found or access denied" },
        { status: 404 }
      );
    }

    await prisma.savedTechnician.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/saved]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
