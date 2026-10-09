import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const job = await prisma.jobPosting.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            companyName: true,
            logoUrl: true,
            location: true,
            description: true,
            website: true,
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job posting not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error("[GET /api/jobs/[id]]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const companyProfile = await prisma.productionCompany.findUnique({
      where: { userId: session.user.id },
    });

    if (!companyProfile) {
      return NextResponse.json(
        { error: "Company profile not found" },
        { status: 404 }
      );
    }

    const job = await prisma.jobPosting.findUnique({ where: { id } });
    if (!job) {
      return NextResponse.json(
        { error: "Job posting not found" },
        { status: 404 }
      );
    }

    if (job.companyId !== companyProfile.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      description,
      roleNeeded,
      startDate,
      endDate,
      budget,
      location,
      skillsRequired,
    } = body;

    const updatedJob = await prisma.jobPosting.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(roleNeeded !== undefined && { roleNeeded }),
        ...(startDate !== undefined && {
          startDate: startDate ? new Date(startDate) : null,
        }),
        ...(endDate !== undefined && {
          endDate: endDate ? new Date(endDate) : null,
        }),
        ...(budget !== undefined && { budget }),
        ...(location !== undefined && { location }),
        ...(skillsRequired !== undefined && { skillsRequired }),
      },
      include: {
        company: {
          select: {
            id: true,
            companyName: true,
            logoUrl: true,
            location: true,
          },
        },
      },
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error("[PUT /api/jobs/[id]]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const companyProfile = await prisma.productionCompany.findUnique({
      where: { userId: session.user.id },
    });

    if (!companyProfile) {
      return NextResponse.json(
        { error: "Company profile not found" },
        { status: 404 }
      );
    }

    const job = await prisma.jobPosting.findUnique({ where: { id } });
    if (!job) {
      return NextResponse.json(
        { error: "Job posting not found" },
        { status: 404 }
      );
    }

    if (job.companyId !== companyProfile.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.jobPosting.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/jobs/[id]]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
