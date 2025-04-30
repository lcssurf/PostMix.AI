import { getUser } from "@/server/auth";
// import { NewUserProfileForm } from "@/app/(app)/_components/new-user-profile-form";
// import { NewUserOrgForm } from "@/app/(app)/_components/new-user-org-form";
// import { cookies } from "next/headers";
// import { new_user_setup_step_cookie } from "@/config/cookie-keys";
// import { NewUserOnboardVideo } from "./NewUserOnboardVideo";
import { completeNewUserSetupMutation, updateNameMutation } from "@/server/actions/user/mutations";
import { createOrgMutation } from "@/server/actions/organization/mutations";

// export async function NewUserSetup() {
//     const user = await getUser();

//     if (!user?.isNewUser) {
//         return null;
//     }

//     const currentStep =
//         cookies().get(`${new_user_setup_step_cookie}${user.id}`)?.value ?? 1;

//     const forms = {
//         1: <NewUserProfileForm user={user} currentStep={Number(currentStep)} />,
//         // 2: <NewUserOrgForm currentStep={Number(currentStep)} userId={user?.id}/>,
//         2: <NewUserOnboardVideo currentStep={Number(currentStep)} userId={user?.id} />,
//     };

//     return (
//         <div className="fixed inset-0 flex h-screen w-screen flex-col items-center justify-center bg-black/80">
//             <div className="w-full max-w-xl">
//                 {forms[currentStep as keyof typeof forms]}
//             </div>
//         </div>
//     );
// }

export async function NewUserSetup() {
    const user = await getUser();
  
    if (!user?.isNewUser) return null;
  
    try {
      // Nome automático: nome atual, parte do email ou fallback
      const name = user.name || user.email?.split("@")[0] || "Usuário";
  
      await updateNameMutation({ name });
  
      await createOrgMutation({
        name: `${name}'s Organization`,
        email: user.email ?? "placeholder@email.com",
      });
  
      await completeNewUserSetupMutation();
  
      console.log(`[Setup] Novo usuário configurado: ${user.email}`);
    } catch (error) {
      console.error("[Setup] Erro ao configurar novo usuário:", error);
    }
  
    return null;
  }
