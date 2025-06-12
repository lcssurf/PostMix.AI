"use server";

import { toast } from "sonner";
import { db } from "@/server/db";
import { projects, projectsInsertSchema } from "@/server/db/schema";
import { adminProcedure, protectedProcedure } from "@/server/procedures";
import { and, eq } from "drizzle-orm";
import type { z } from "zod";

type CreateProjectType = z.infer<typeof projectsInsertSchema>;

export async function createCanvaProject(data:CreateProjectType) {
const { user } = await protectedProcedure();

    // Make sure to import 'projects' from your schema if not already imported
    const { name, userId, ...rest } = data;
    const project = await db
        .insert(projects)
        .values({
            name: name,
            userId: userId,
            isPro: true,
            ...rest
        })
        .returning();

        if (!project) {
            
            throw new Error("Failed to create project");
        }
        //  toast.success("Projeto criado.");
        console.log("Project created:", project);
        
    return project;
}

type UpdateProjectType = Partial<z.infer<typeof projectsInsertSchema>>;

export async function updateProject(id: string, data: UpdateProjectType) {
  const { user } = await protectedProcedure();

  const updatedProject = await db
    .update(projects)
    .set(data)
    .where(and(eq(projects.id, id), eq(projects.userId, user.id)))
    .returning();

  if (!updatedProject || updatedProject.length === 0) {
    throw new Error("Failed to update project");
  }

  console.log("Project updated:", updatedProject[0]);

  return updatedProject[0];
}