import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "TECHNICIAN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: jobPostingId } = params;

    const job = await prisma.jobPosting.findUnique({
      where: { id: jobPostingId },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job posting not found" },
        { status: 404 }
      );
    }

    const technicianProfile = await prisma.technicianProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!technicianProfile) {
      return NextResponse.json(
        { error: "Technician profile not found. Please complete your profile first." },
        { status: 404 }
      );
    }

    // Prevent duplicate applications
    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        jobId: jobPostingId,
        technicianId: technicianProfile.id,
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied to this job" },
        { status: 409 }
      );
    }

    const body = await req.json();
    const { coverLetter } = body;

    const application = await prisma.jobApplication.create({
      data: {
        jobId: jobPostingId,
        technicianId: technicianProfile.id,
        coverLetter,
        status: "PENDING",
      },
      include: {
        job: {
          select: { id: true, title: true, roleNeeded: true },
        },
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("[POST /api/jobs/[id]/apply]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
