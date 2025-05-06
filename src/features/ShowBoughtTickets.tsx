"use client";
import { rGetTicketsByUser } from "@/shared/api/games";
import { Ticket } from "@/shared/types";
import { TicketsView } from "@/widgets";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useTranslations } from "next-intl";
import { useQuery } from "react-query";
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
  return (
    <>
      <Modal
        fullScreen
        size={"lg"}
        opened={opened}
        onClose={close}
        title={t("myTickets")}
      >
        {tickets && <TicketsView type="ticket" tickets={tickets} mb={0} />}
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
