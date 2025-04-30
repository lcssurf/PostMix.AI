"use client";

import { SubscribeBtn } from "@/app/(app)/(user)/org/billing/_components/subscribe-btn";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type SwitchPlanModalProps = {
    variantId: number | undefined;
    lastCardDigits: string;
    cardBrand: string;
    currencySymbol: string;
    price: number;
    currencyCode: string;
    planName: string;
    status: string;
    billingPeriod: "monthly" | "yearly",
};

export function SwitchPlanModal({
    cardBrand,
    currencyCode,
    currencySymbol,
    lastCardDigits,
    planName,
    price,
    variantId,
    status,
    billingPeriod,
}: SwitchPlanModalProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        <AlertDialog open={isOpen} onOpenChange={(o) => setIsOpen(o)}>
            <AlertDialogTrigger asChild>
                {status === "active" ? (
                    <Button variant="outline" className="w-full">
                        Mudar para {currencySymbol}
                        {price} /{billingPeriod === "monthly" ? "mês" : "ano"}
                    </Button>
                ) : (
                    <Button variant="outline" className="w-full">
                        Assinar {currencySymbol}
                        {price} /{billingPeriod === "monthly" ? "mês" : "ano"}
                    </Button>
                )}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {status === "active" ? "Confirmar mudança de plano para" : "Confirmar assinatura do plano"} {planName}
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        {status === "active" ? (
                            <p>
                                Você já possui uma assinatura ativa. Ao mudar para o plano <strong>{planName}</strong>, utilizaremos seu cartão {cardBrand} final {lastCardDigits}. O novo valor será de <strong>{price} {currencyCode}</strong> por ciclo de cobrança.
                            </p>
                        ) : (
                            <p>
                                Ao confirmar, sua assinatura no plano <strong>{planName}</strong> será ativada e o valor de <strong>{price} {currencyCode}</strong> será cobrado automaticamente. Você pode cancelar quando quiser.
                            </p>
                        )}
                    </AlertDialogDescription>

                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Voltar</AlertDialogCancel>
                    <SubscribeBtn variantId={variantId}>
                        {status === "active" ? "Confirmar mudança" : "Confirmar assinatura"}
                    </SubscribeBtn>
                </AlertDialogFooter>

            </AlertDialogContent>
        </AlertDialog>
    );
}
