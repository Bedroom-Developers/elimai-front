'use client'

import { UserBoughtTicketsTable } from "@/modules/tickets/ui/components/UserBoughtTicketsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useTranslations } from "next-intl";
import { UserCertificate } from "./UserCertificate";

export const UserProfile = () => {

    const t = useTranslations();
    return <section className="max-w-7xl mx-auto flex items-center justify-center">
        <Tabs defaultValue="tickets" className="w-full">
            <TabsList className="mx-auto gap-2">
                <TabsTrigger value="tickets">{t("profile.first")}</TabsTrigger>
                <TabsTrigger value="cert">{t("profile.third")}</TabsTrigger>
            </TabsList>
            <TabsContent value="tickets" className="border p-2 rounded-md">
                <UserBoughtTicketsTable />
            </TabsContent>
            <TabsContent value="cert"><UserCertificate /></TabsContent>
        </Tabs>
    </section>
}