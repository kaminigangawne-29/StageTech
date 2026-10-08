import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getTechnicianProfile(userId: string) {
  return prisma.technicianProfile.findUnique({ where: { userId } });
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const technicianProfile = await getTechnicianProfile(session.user.id);
    if (!technicianProfile) {
      return NextResponse.json(
        { error: "Technician profile not found" },
        { status: 404 }
      );
    }

    const history = await prisma.productionHistory.findMany({
      where: { technicianId: technicianProfile.id },
      orderBy: { startDate: "desc" },
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error("[GET /api/history]", error);
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

    const technicianProfile = await getTechnicianProfile(session.user.id);
    if (!technicianProfile) {
      return NextResponse.json(
        { error: "Technician profile not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { showTitle, company, roleHeld, startDate, endDate, description } =
      body;

    if (!showTitle || !roleHeld || !startDate) {
      return NextResponse.json(
        { error: "showTitle, roleHeld, and startDate are required" },
        { status: 400 }
      );
    }

    const entry = await prisma.productionHistory.create({
      data: {
        technicianId: technicianProfile.id,
        showTitle,
        company,
        roleHeld,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        description,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("[POST /api/history]", error);
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
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "History entry id is required" },
        { status: 400 }
      );
    }

    const technicianProfile = await getTechnicianProfile(session.user.id);
    if (!technicianProfile) {
      return NextResponse.json(
        { error: "Technician profile not found" },
        { status: 404 }
      );
    }

    const entry = await prisma.productionHistory.findFirst({
      where: { id, technicianId: technicianProfile.id },
    });

    if (!entry) {
      return NextResponse.json(
        { error: "History entry not found or access denied" },
        { status: 404 }
      );
    }

    await prisma.productionHistory.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/history]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
