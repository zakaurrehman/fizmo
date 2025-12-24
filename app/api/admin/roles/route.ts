import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

/**
 * GET /api/admin/roles
 * Fetch all roles with user counts
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all roles
    const roles = await prisma.role.findMany({
      orderBy: { createdAt: "asc" },
    });

    // Get user counts for each role
    const rolesWithCounts = await Promise.all(
      roles.map(async (role) => {
        const userCount = await prisma.user.count({
          where: { role: role.name as any },
        });

        return {
          id: role.id,
          name: role.name,
          description: role.description,
          permissions: role.permissions,
          isSystem: role.isSystem,
          userCount,
          createdAt: role.createdAt.toISOString(),
        };
      })
    );

    return NextResponse.json({
      success: true,
      roles: rolesWithCounts,
    });
  } catch (error: any) {
    console.error("Roles fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/roles
 * Create a new role
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, permissions, isSystem } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Role name is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(permissions)) {
      return NextResponse.json(
        { error: "Permissions must be an array" },
        { status: 400 }
      );
    }

    // Check if role already exists
    const existing = await prisma.role.findUnique({
      where: { name },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Role with this name already exists" },
        { status: 400 }
      );
    }

    // Create role
    const role = await prisma.role.create({
      data: {
        name,
        description: description || null,
        permissions,
        isSystem: isSystem || false,
      },
    });

    return NextResponse.json({
      success: true,
      role: {
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        isSystem: role.isSystem,
        userCount: 0,
        createdAt: role.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Role creation error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/roles
 * Update an existing role
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, description, permissions } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Role ID is required" },
        { status: 400 }
      );
    }

    // Check if role exists
    const existing = await prisma.role.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Role not found" },
        { status: 404 }
      );
    }

    // Prevent editing system roles
    if (existing.isSystem) {
      return NextResponse.json(
        { error: "System roles cannot be edited" },
        { status: 403 }
      );
    }

    // Update role
    const role = await prisma.role.update({
      where: { id },
      data: {
        name: name || existing.name,
        description: description !== undefined ? description : existing.description,
        permissions: permissions || existing.permissions,
      },
    });

    return NextResponse.json({
      success: true,
      role: {
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        isSystem: role.isSystem,
        createdAt: role.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Role update error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/roles
 * Delete a role
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Role ID is required" },
        { status: 400 }
      );
    }

    // Check if role exists
    const existing = await prisma.role.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Role not found" },
        { status: 404 }
      );
    }

    // Prevent deleting system roles
    if (existing.isSystem) {
      return NextResponse.json(
        { error: "System roles cannot be deleted" },
        { status: 403 }
      );
    }

    // Check if any users have this role
    const userCount = await prisma.user.count({
      where: { role: existing.name as any },
    });

    if (userCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete role with ${userCount} assigned users` },
        { status: 400 }
      );
    }

    // Delete role
    await prisma.role.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (error: any) {
    console.error("Role deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
