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
            userId: user.id,
            isPro: true,
            ...rest
        });

        if (!project) {
            
            throw new Error("Failed to create project");
        }
        //  toast.success("Projeto criado.");
        console.log("Project created:", project);
        
    return project;
}