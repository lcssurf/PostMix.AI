"use server";
import { db } from "@/server/db";
import {
    accounts,
    contentTypeEnum,
    generatedContents,
    userInsertSchema,
    users,
} from "@/server/db/schema";
import { protectedProcedure, superAdminProcedure } from "@/server/procedures";
import { desc, eq } from "drizzle-orm";
import type { z } from "zod";
import { z as zod } from "zod";



/**
 * Get the generated content by id
 * @param id The id of the content
 */
const getGeneratedContentByIdSchema = zod.object({
    id: zod.string(),
});
type GetGeneratedContentByIdProps = z.infer<
    typeof getGeneratedContentByIdSchema
>;
export async function getGeneratedContentById(
    input: GetGeneratedContentByIdProps,
) {
    const parsed = await getGeneratedContentByIdSchema.safeParseAsync(input);

    if (!parsed.success) {
        throw new Error("Invalid content id", {
            cause: parsed.error.errors,
        });
    }

    const result = await db
        .select({ content: generatedContents.content })
        .from(generatedContents)
        .where(eq(generatedContents.id, parsed.data.id))
        .limit(1);

    if (!result.length) {
        throw new Error("Content not found");
    }

    return result[0];
}



/**
 * Insert generated content for the authenticated user
 * @param contentType The type of content
 * @param content The content data
 */
const insertGeneratedContentSchema = zod.object({
    contentType: zod.enum(contentTypeEnum.enumValues), // use the correct property for enum values
    content: zod.record(zod.any()),
});
type InsertGeneratedContentProps = z.infer<typeof insertGeneratedContentSchema>;

export async function saveGeneratedContentMutation(
    input: InsertGeneratedContentProps,
) {
    const { user } = await protectedProcedure();

    const parsed = await insertGeneratedContentSchema.safeParseAsync(input);

    if (!parsed.success) {
        throw new Error("Invalid content data", {
            cause: parsed.error.errors,
        });
    }

    return await db
        .insert(generatedContents)
        .values({
            userId: user.id,
            contentType: parsed.data.contentType,
            content: parsed.data.content,
        })
        .returning(); // se quiser retornar o id ou dados inseridos
}

/**
 * Update the canvaState and canvaCodeVerifier of the user
 * @param canvaState The new state
 * @param canvaCodeVerifier The new codeVerifier
 */

const updateStateAndCodeVerifierSchema = userInsertSchema.pick({
    canvaState: true,
    canvaCodeVerifier: true,
});

type UpdateStateAndCodeVerifierProps = z.infer<
    typeof updateStateAndCodeVerifierSchema
>;

export async function updateStateAndCodeVerifierMutation({
    canvaState,
    canvaCodeVerifier,
}: UpdateStateAndCodeVerifierProps) {
    const { user } = await protectedProcedure();

    const parsed = await updateStateAndCodeVerifierSchema.safeParseAsync({
        canvaState,
        canvaCodeVerifier,
    });

    if (!parsed.success) {
        throw new Error("Invalid canvaState or canvaCodeVerifier", {
            cause: parsed.error.errors,
        });
    }

    return await db
        .update(users)
        .set({
            canvaState: parsed.data.canvaState,
            canvaCodeVerifier: parsed.data.canvaCodeVerifier,
        })
        .where(eq(users.id, user.id))
        .execute();
}

/**
 * Get the stored Canva state and code_verifier for the authenticated user.
 */
export async function getCanvaAuthSessionData() {
    const { user } = await protectedProcedure();

    const result = await db
        .select({
            canvaState: users.canvaState,
            canvaCodeVerifier: users.canvaCodeVerifier,
            canvaAccessToken: users.canvaAccessToken,
            canvaRefreshToken: users.canvaRefreshToken,
            canvaTokenExpiresAt: users.canvaTokenExpiresAt,
        })
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1);

    if (
        !result.length ||
        !result[0]?.canvaState ||
        !result[0]?.canvaCodeVerifier
    ) {
        throw new Error("No Canva session data found for the user.");
    }

    return {
        canvaState: result[0].canvaState,
        canvaCodeVerifier: result[0].canvaCodeVerifier,
        canvaAccessToken: result[0].canvaAccessToken,
        canvaRefreshToken: result[0].canvaRefreshToken,
        canvaTokenExpiresAt: result[0].canvaTokenExpiresAt,
    };
}

/**
 * Save Canva tokens for the authenticated user
 * @param tokenData The token data to save
 */
export async function saveCanvaTokensMutation(tokenData: {
    access_token: string;
    refresh_token: string;
    expires_in: number; // segundos até expirar
}) {
    const { user } = await protectedProcedure();

    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

    return await db
        .update(users)
        .set({
            canvaAccessToken: tokenData.access_token,
            canvaRefreshToken: tokenData.refresh_token,
            canvaTokenExpiresAt: expiresAt,
            updatedAt: new Date(),
        })
        .where(eq(users.id, user.id))
        .execute();
}

/**
 * Update the name of the user
 * @param name The new name
 */

const updateNameSchema = userInsertSchema.pick({ name: true });

type UpdateNameProps = z.infer<typeof updateNameSchema>;

export async function updateNameMutation({ name }: UpdateNameProps) {
    const { user } = await protectedProcedure();

    const updateNameParse = await updateNameSchema.safeParseAsync({ name });

    if (!updateNameParse.success) {
        throw new Error("Invalid name", {
            cause: updateNameParse.error.errors,
        });
    }

    return await db
        .update(users)
        .set({ name: updateNameParse.data.name })
        .where(eq(users.id, user.id))
        .execute();
}

/**
 * Update the image of the user
 * @param image The new image
 */

const updateImageSchema = userInsertSchema.pick({ image: true });

type UpdateImageProps = z.infer<typeof updateImageSchema>;

export async function updateImageMutation({ image }: UpdateImageProps) {
    const { user } = await protectedProcedure();

    const updateImageParse = await updateImageSchema.safeParseAsync({ image });

    if (!updateImageParse.success) {
        throw new Error("Invalid image", {
            cause: updateImageParse.error.errors,
        });
    }

    return await db
        .update(users)
        .set({ image: updateImageParse.data.image })
        .where(eq(users.email, user.email!))
        .execute();
}

/**
 * Update the role of a user (super admin only)
 * @param id The user id
 * @param role The new role
 */

const updateRoleSchema = userInsertSchema.pick({
    role: true,
    id: true,
});

type UpdateRoleProps = z.infer<typeof updateRoleSchema>;

export async function updateRoleMutation({ role, id }: UpdateRoleProps) {
    await superAdminProcedure();

    const updateRoleParse = await updateRoleSchema.safeParseAsync({ role, id });

    if (!updateRoleParse.success) {
        throw new Error("Invalid role data", {
            cause: updateRoleParse.error.errors,
        });
    }

    return await db
        .update(users)
        .set({ role: updateRoleParse.data.role })
        .where(eq(users.id, updateRoleParse.data.id))
        .execute();
}

/**
 * Delete a user (super admin only)
 * @param id The user id
 */

const deleteUserSchema = userInsertSchema.pick({ id: true });

type DeleteUserProps = z.infer<typeof deleteUserSchema>;

export async function deleteUserMutation({ id }: DeleteUserProps) {
    await superAdminProcedure();

    const deleteUserParse = await deleteUserSchema.safeParseAsync({ id });

    if (!deleteUserParse.success) {
        throw new Error("Invalid user id", {
            cause: deleteUserParse.error.errors,
        });
    }

    await db
        .delete(accounts)
        .where(eq(accounts.userId, deleteUserParse.data.id))
        .execute();

    return await db
        .delete(users)
        .where(eq(users.id, deleteUserParse.data.id))
        .execute();
}

/**
 *  complete new user setup
 * @returns
 */

export async function completeNewUserSetupMutation() {
    const { user } = await protectedProcedure();

    return await db
        .update(users)
        .set({ isNewUser: false })
        .where(eq(users.id, user.id))
        .execute();
}
