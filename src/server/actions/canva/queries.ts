"use server";

import { db } from "@/server/db";
import { projects } from "@/server/db/schema";
import { protectedProcedure } from "@/server/procedures";
import { and, eq } from "drizzle-orm";

type PaginatedProjects = {
    data: typeof projects.$inferSelect[];
    nextPage: number | null;
};

export async function getAllCanvaProjects({ page = 1, limit = 5 }: { page?: number; limit?: number } = {}): Promise<PaginatedProjects> {
    const { user } = await protectedProcedure();

    const offset = (page - 1) * limit;

    const data = await db
        .select()
        .from(projects)
        .where(eq(projects.userId, user.id))
        .limit(limit)
        .offset(offset);

    // Verifica se há mais páginas
    const totalResult = await db
        .select()
        .from(projects)
        .where(eq(projects.userId, user.id));

    const total = totalResult.length;

    const hasNextPage = page * limit < total;

    return {
        data,
        nextPage: hasNextPage ? page + 1 : null,
    };
}


export async function getAllTemplateProjects({ page = 1, limit = 5 }: { page?: number; limit?: number } = {}): Promise<PaginatedProjects> {
    const offset = (page - 1) * limit;

    const data = await db
        .select()
        .from(projects)
        .where(eq(projects.isTemplate, true))
        .limit(limit)
        .offset(offset);

    const totalResult = await db
        .select()
        .from(projects)
        .where(eq(projects.isTemplate, true));

    const total = totalResult.length;
    const hasNextPage = page * limit < total;

    return {
        data,
        nextPage: hasNextPage ? page + 1 : null,
    };
}

export async function getProjectById(projectId: string) {
    const { user } = await protectedProcedure();

    const project = await db
        .select()
        .from(projects)
        .where(and(eq(projects.id, projectId), eq(projects.userId, user.id)))
        .limit(1);

    return project[0] || null;
}