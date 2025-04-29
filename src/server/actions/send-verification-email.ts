"use server";

import { type SendVerificationRequestParams } from "next-auth/providers/email";
import { resend } from "@/server/resend";
import { siteConfig } from "@/config/site";
import { siteUrls } from "@/config/urls";

interface SendVerificationEmailProps {
    params: SendVerificationRequestParams;
}

// Send a verification email to the user

export async function sendVerificationEmail({
    params,
}: SendVerificationEmailProps) {
    try {
        //send email to user via resend
        await resend.emails.send({
            from: siteConfig.noReplyEmail,
            to: params.identifier,
            subject: `Verifique seu endereço de email | ${siteConfig.name}`,
            html: `
            <div>
                <a href="${siteUrls.rapidlaunch}">${siteConfig.name}</a>
                <h1>🪄 Seu link mágico</h1>
                <p>
                Clique no link abaixo para verificar seu endereço de email e
                fazer login.
                </p>
                <a href="${params.url}">Verifique seu email</a>

                <p> ou </p>

                <p>
                Copie e cole o seguinte link no seu navegador:
                <br />
                ${params.url}
                </p>

                <hr />
                <p>
                Se você não solicitou este email, pode ignorá-lo.
                </p>
            </div>`,
            text: `Clique no link abaixo para verificar seu endereço de email e fazer login. ${params.url}`,
            tags: [
                {
                    name: "category",
                    value: "confirm_email",
                },
            ],
        });
    } catch (error) {
        throw new Error("Falha ao enviar o email de verificação");
    }
}
