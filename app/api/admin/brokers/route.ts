import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

/**
 * GET /api/admin/brokers
 * Get all brokers (SUPER_ADMIN only)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only SUPER_ADMIN can manage brokers
    if (user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const brokers = await prisma.broker.findMany({
      include: {
        _count: {
          select: {
            users: true,
            clients: true,
            accounts: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const brokersWithStats = brokers.map((broker) => ({
      id: broker.id,
      name: broker.name,
      slug: broker.slug,
      domain: broker.domain,
      status: broker.status,
      settings: broker.settings,
      createdAt: broker.createdAt,
      updatedAt: broker.updatedAt,
      stats: {
        totalUsers: broker._count.users,
        totalClients: broker._count.clients,
        totalAccounts: broker._count.accounts,
      },
    }));

    return NextResponse.json({
      success: true,
      brokers: brokersWithStats,
    });
  } catch (error: any) {
    console.error("Fetch brokers error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/brokers
 * Create a new broker (SUPER_ADMIN only)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only SUPER_ADMIN can create brokers
    if (user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { name, slug, domain, settings } = body;

    // Validation
    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    // Validate slug format (lowercase, alphanumeric, hyphens only)
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        { error: "Slug must contain only lowercase letters, numbers, and hyphens" },
        { status: 400 }
      );
    }

    // Check for duplicate slug
    const existingSlug = await prisma.broker.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: "A broker with this slug already exists" },
        { status: 400 }
      );
    }

    // Check for duplicate domain if provided
    if (domain) {
      const existingDomain = await prisma.broker.findUnique({
        where: { domain },
      });

      if (existingDomain) {
        return NextResponse.json(
          { error: "A broker with this domain already exists" },
          { status: 400 }
        );
      }
    }

    // Create broker
    const broker = await prisma.broker.create({
      data: {
        name,
        slug,
        domain: domain || null,
        settings: settings || null,
        status: "ACTIVE",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Broker created successfully",
      broker: {
        id: broker.id,
        name: broker.name,
        slug: broker.slug,
        domain: broker.domain,
        status: broker.status,
        createdAt: broker.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Create broker error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/brokers
 * Update a broker (SUPER_ADMIN only)
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only SUPER_ADMIN can update brokers
    if (user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, slug, domain, status, settings } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Broker ID is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.broker.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Broker not found" }, { status: 404 });
    }

    // Check for slug conflict
    if (slug && slug !== existing.slug) {
      const slugRegex = /^[a-z0-9-]+$/;
      if (!slugRegex.test(slug)) {
        return NextResponse.json(
          { error: "Slug must contain only lowercase letters, numbers, and hyphens" },
          { status: 400 }
        );
      }

      const duplicate = await prisma.broker.findUnique({
        where: { slug },
      });

      if (duplicate) {
        return NextResponse.json(
          { error: "Slug already in use" },
          { status: 400 }
        );
      }
    }

    // Check for domain conflict
    if (domain && domain !== existing.domain) {
      const duplicate = await prisma.broker.findUnique({
        where: { domain },
      });

      if (duplicate) {
        return NextResponse.json(
          { error: "Domain already in use" },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.broker.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(domain !== undefined && { domain: domain || null }),
        ...(status && { status }),
        ...(settings !== undefined && { settings }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Broker updated successfully",
      broker: updated,
    });
  } catch (error: any) {
    console.error("Update broker error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/brokers
 * Delete a broker (SUPER_ADMIN only)
 * WARNING: This will fail if the broker has associated data
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only SUPER_ADMIN can delete brokers
    if (user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Broker ID is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.broker.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            clients: true,
            accounts: true,
          },
        },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Broker not found" }, { status: 404 });
    }

    // Check if broker has associated data
    const totalRecords =
      existing._count.users +
      existing._count.clients +
      existing._count.accounts;

    if (totalRecords > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete broker with ${totalRecords} associated records. Please migrate or delete all users, clients, and accounts first.`,
        },
        { status: 400 }
      );
    }

    await prisma.broker.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Broker deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete broker error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
