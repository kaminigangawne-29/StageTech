import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const role = searchParams.get("role");
    const location = searchParams.get("location");
    const mine = searchParams.get("mine") === "true";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") ?? searchParams.get("pageSize") ?? "12", 10))
    );
    const offset = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (mine) {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const company = await prisma.productionCompany.findUnique({
        where: { userId: session.user.id },
      });
      if (!company) {
        return NextResponse.json({ data: [], jobs: [], total: 0 });
      }
      where.companyId = company.id;
    }

    if (role) {
      where.roleNeeded = { contains: role };
    }

    if (location) {
      where.location = { contains: location };
    }

    const [total, jobs] = await Promise.all([
      prisma.jobPosting.count({ where }),
      prisma.jobPosting.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          company: {
            select: {
              id: true,
              companyName: true,
              logoUrl: true,
              location: true,
            },
          },
          _count: {
            select: {
              applications: true,
            },
          },
        },
      }),
    ]);

    const formattedJobs = jobs.map((j) => ({
      ...j,
      applicantCount: (j as any)._count?.applications ?? 0,
    }));

    return NextResponse.json({
      data: formattedJobs,
      jobs: formattedJobs,
      total,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/jobs]", error);
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

    const companyProfile = await prisma.productionCompany.findUnique({
      where: { userId: session.user.id },
    });

    if (!companyProfile) {
      return NextResponse.json(
        { error: "Company profile not found. Please complete your profile first." },
        { status: 404 }
      );
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

    if (!title || !roleNeeded) {
      return NextResponse.json(
        { error: "title and roleNeeded are required" },
        { status: 400 }
      );
    }

    const job = await prisma.jobPosting.create({
      data: {
        companyId: companyProfile.id,
        title,
        description: description || "",
        roleNeeded,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        budget: budget ?? null,
        location: location || companyProfile.location || "Mumbai",
        skillsRequired: Array.isArray(skillsRequired)
          ? JSON.stringify(skillsRequired)
          : skillsRequired ?? "[]",
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

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("[POST /api/jobs]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
