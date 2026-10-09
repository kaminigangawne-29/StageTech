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

    const portfolioItems = await prisma.portfolioItem.findMany({
      where: { technicianId: technicianProfile.id },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(portfolioItems);
  } catch (error) {
    console.error("[GET /api/portfolio]", error);
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
    const { title, description, mediaUrl, mediaType, sortOrder } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const portfolioItem = await prisma.portfolioItem.create({
      data: {
        technicianId: technicianProfile.id,
        title,
        description: description || "",
        mediaUrl: mediaUrl || "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800",
        mediaType: mediaType || "IMAGE",
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json(portfolioItem, { status: 201 });
  } catch (error) {
    console.error("[POST /api/portfolio]", error);
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
        { error: "Portfolio item id is required" },
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

    const item = await prisma.portfolioItem.findFirst({
      where: { id, technicianId: technicianProfile.id },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Portfolio item not found or access denied" },
        { status: 404 }
      );
    }

    await prisma.portfolioItem.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/portfolio]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
