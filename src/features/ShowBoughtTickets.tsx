"use client";
import { rGetTicketsByUser } from "@/shared/api/games";
import { Ticket } from "@/shared/types";
import { TicketsView } from "@/widgets";
import { Modal, Skeleton, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { AuthProtectedButton } from "./AuthProtectedBtn";
export const ShowBoughtTickets = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const {
    data: tickets,
    isLoading,
    error,
  } = useQuery<
    Ticket[],
    { message: string; status: number },
    Ticket[],
    string[]
  >({
    queryKey: ["tickets user btn"],
    queryFn: async () => {
      return rGetTicketsByUser();
    },
    enabled: opened,
  });
  const t = useTranslations("gamesTable");
  const tG = useTranslations();
  return (
    <>
      <Modal
        fullScreen
        size={"lg"}
        opened={opened}
        onClose={close}
        title={t("myTickets")}
        pb={20}
      >
        {isLoading ? (
          <Skeleton w={"100%"} h={"500"} />
        ) : error ? (
          <Text c={"gray.6"}>{tG("profile.errors.notFoundTickets.desc")}</Text>
        ) : (
          tickets && <TicketsView type="ticket" tickets={tickets} mb={0} />
        )}
      </Modal>
      <AuthProtectedButton
        btnProps={{ w: { xs: "100%", md: "auto" } }}
        disabled={false}
        variant={"base"}
        label={t("myTickets")}
        action={open}
      />
    </>
  );
};
