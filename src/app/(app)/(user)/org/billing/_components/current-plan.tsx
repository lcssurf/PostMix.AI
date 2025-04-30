import { CancelPauseResumeBtns } from "@/app/(app)/(user)/org/billing/_components/cancel-pause-resume-btns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { OrgSubscription } from "@/types/org-subscription";
import { format } from "date-fns";
import { redirect } from "next/navigation";

type CurrentPlanProps = {
    subscription: OrgSubscription;
};

export function CurrentPlan({ subscription }: CurrentPlanProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Plano Atual</CardTitle>
                <CardDescription>
                    Gerencie e visualize seu plano atual
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <p>
                            <span className="font-semibold">Plano:</span>{" "}
                            {subscription ? subscription.plan?.title : "Free"}
                        </p>

                        {subscription?.status_formatted && (
                            <Badge variant="secondary">
                                {subscription.status_formatted}
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {subscription ? (
                            <>
                                {subscription.status === "active" &&
                                    "Renova em " +
                                        format(subscription.renews_at, "pp")}

                                {subscription.status === "paused" &&
                                    "Sua assinatura está pausada"}

                                {subscription.status === "cancelled" &&
                                    subscription.ends_at &&
                                    `${
                                        new Date(subscription.ends_at) >
                                        new Date()
                                            ? "Termina em "
                                            : "Terminou em "
                                    }` + format(subscription.ends_at, "pp")}
                            </>
                        ) : (
                            "Sem data de expiração"
                        )}
                    </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <form
                        action={async () => {
                            "use server";

                            if (subscription?.customerPortalUrl) {
                                redirect(subscription?.customerPortalUrl);
                            }
                        }}
                    >
                        <Button disabled={!subscription} variant="outline">
                            Gerencie suas configurações de cobrança
                        </Button>
                    </form>

                    <CancelPauseResumeBtns subscription={subscription} />
                </div>
            </CardContent>
        </Card>
    );
}
