"use client";
import { AuthProtectedButton, DownloadBtn } from "@/features";
import { Link, useRouter } from "@/i18n/routing";
import {
  rGetCertByUser,
  rGetSubByUser,
  rGetTicketsByUser,
} from "@/shared/api/games";
import { Shareholder, Ticket } from "@/shared/types";
import {
  Alert,
  Box,
  Button,
  ButtonProps,
  Center,
  LoadingOverlay,
  Stack,
  Table,
  Tabs,
} from "@mantine/core";
import { AlertTriangle, CircleX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useQuery } from "react-query";

export const Profile = () => {
  const t = useTranslations();
  return (
    <Tabs
      mt={10}
      mx={"auto"}
      maw={1200}
      w={"100%"}
      color={"elimai.6"}
      defaultValue="first"
    >
      <Tabs.List grow justify="center">
        <Tabs.Tab value="first">{t("profile.first")}</Tabs.Tab>
        <Tabs.Tab value="second">{t("profile.second")}</Tabs.Tab>
        <Tabs.Tab value="third">{t("profile.third")}</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel w={"100%"} pt={10} px={{ sm: 5, lg: 0 }} value="first">
        <TicketsTable />
      </Tabs.Panel>
      <Tabs.Panel w={"100%"} pt={10} px={{ sm: 5, lg: 0 }} value="second">
        <SubSection />
      </Tabs.Panel>
      <Tabs.Panel w={"100%"} pt={10} px={{ sm: 5, lg: 0 }} value="third">
        <CertSection />
      </Tabs.Panel>
    </Tabs>
  );
};
const SubSection = () => {
  const t = useTranslations();
  const router = useRouter();
  const {
    data: sub,
    isLoading,
    error,
  } = useQuery<Ticket, { message: string; status: number }, Ticket, string[]>({
    queryKey: ["sub user"],
    queryFn: async () => {
      return rGetSubByUser();
    },
  });
  if (isLoading) {
    return (
      <Box w={"100%"} h={250} pos="relative">
        <LoadingOverlay
          loaderProps={{ color: "elimai.6" }}
          visible={isLoading}
          zIndex={1000}
        />
      </Box>
    );
  }
  if (error?.status === 404) {
    return (
      <Box h={250} maw={1200}>
        <Alert
          w={"100%"}
          icon={<AlertTriangle />}
          variant="filled"
          color="elimai.2"
          my={20}
          title={t("profile.errors.notFoundSub.title")}
        >
          {t("profile.errors.notFoundSub.desc")}
        </Alert>
        <AuthProtectedButton<ButtonProps>
          label={t("buy.subBtn")}
          variant="alert"
          btnProps={{ w: "100%" }}
          action={() => {
            router.push("/subscription");
          }}
        />
      </Box>
    );
  }
  if (error) {
    return (
      <Center w={"100%"} h={250} maw={1200} mx={"auto"}>
        <Alert
          icon={<CircleX />}
          variant="filled"
          color="red.4"
          my={20}
          title={t("profile.errors.errorSub.title")}
        >
          {t("profile.errors.errorSub.desc")}
        </Alert>
      </Center>
    );
  }
  return (
    <Stack>
      <Alert
        icon={<AlertTriangle />}
        p={10}
        variant="filled"
        color="elimai.2"
        title={t("buy.subscriptionDetails.title")}
      >
        <ul>
          <li>{t("buy.subscriptionDetails.description")}</li>
          <li>{t("buy.subscriptionDetails.validity")}</li>
          <li>{t("buy.subscriptionDetails.transferability")}</li>
        </ul>
      </Alert>

      <DownloadBtn tickets={sub ? [sub] : []} type="sub" />
    </Stack>
  );
};
const TicketsTable = () => {
  const t = useTranslations();
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
    queryKey: ["tickets user"],
    queryFn: async () => {
      return rGetTicketsByUser();
    },
  });
  const { locale } = useParams();
  const rows = useMemo(() => {
    if (!tickets) return [];
    const groupedTickets = Object.groupBy(tickets, (ticket) => {
      const key = `name_${locale}` as keyof typeof ticket;
      return ticket[key];
    });
    return Object.keys(groupedTickets).map((key) => (
      <Table.Tr key={key}>
        <Table.Td ta="center">
          {locale == "ru" ? "Елимай" : "Елімай"} — {key}
        </Table.Td>
        <Table.Td ta="center">{groupedTickets[key]?.length}</Table.Td>
        <Table.Td ta="center">
          {groupedTickets[key] && (
            <DownloadBtn type="ticket" tickets={groupedTickets[key]} />
          )}
        </Table.Td>
      </Table.Tr>
    ));
  }, [tickets]);
  if (isLoading) {
    return (
      <Box w={"100%"} h={250} pos="relative">
        <LoadingOverlay
          loaderProps={{ color: "elimai.6" }}
          visible={isLoading}
          zIndex={1000}
        />
      </Box>
    );
  }
  if (error?.status === 404) {
    return (
      <Box w={"100%"} h={250} maw={1200} mx={"auto"}>
        <Alert
          icon={<AlertTriangle />}
          variant="filled"
          color="elimai.2"
          my={20}
          title={t("profile.errors.notFoundTickets.title")}
        >
          {t("profile.errors.notFoundTickets.desc")}
        </Alert>
        <Button variant="base" component={Link} href={"/"} w={"100%"}>
          {t("profile.errors.notFoundTickets.btn")}
        </Button>
      </Box>
    );
  }
  if (error) {
    return (
      <Center w={"100%"} h={250} maw={1200} mx={"auto"}>
        <Alert
          icon={<CircleX />}
          variant="filled"
          color="red.4"
          my={20}
          title={t("profile.errors.errorTickets.title")}
        >
          {t("profile.errors.errorTickets.desc")}
        </Alert>
      </Center>
    );
  }

  return (
    <Stack align="center" my={20}>
      <Table.ScrollContainer
        mt={20}
        mx={"auto"}
        maw={1200}
        minWidth={350}
        w={"100%"}
      >
        <Table
          stripedColor="slate.2"
          withTableBorder
          fz={{
            xs: 14,
            md: 15,
            lg: 16,
          }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th ta={"center"}>{t("gamesTable.game")}</Table.Th>
              <Table.Th ta={"center"}>{t("gamesTable.count")}</Table.Th>
              <Table.Th ta={"center"}>{t("gamesTable.tickets")}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Stack>
  );
};

const CertSection = () => {
  const t = useTranslations();
  const router = useRouter();
  const {
    data: cert,
    isLoading,
    error,
  } = useQuery<
    Shareholder,
    { message: string; status: number },
    Shareholder,
    string[]
  >({
    queryKey: ["cert user"],
    queryFn: async () => {
      return rGetCertByUser();
    },
  });

  if (isLoading) {
    return (
      <Box w={"100%"} h={250} pos="relative">
        <LoadingOverlay
          loaderProps={{ color: "elimai.6" }}
          visible={isLoading}
          zIndex={1000}
        />
      </Box>
    );
  }
  if (error?.status === 404) {
    return (
      <Box h={250} maw={1200}>
        <Alert
          w={"100%"}
          icon={<AlertTriangle />}
          variant="filled"
          color="elimai.2"
          my={20}
          title={t("profile.errors.notFoundCert.title")}
        >
          {t("profile.errors.notFoundCert.desc")}
        </Alert>
      </Box>
    );
  }
  if (error) {
    return (
      <Center w={"100%"} h={250} maw={1200} mx={"auto"}>
        <Alert
          icon={<CircleX />}
          variant="filled"
          color="red.4"
          my={20}
          title={t("profile.errors.errorCert.title")}
        >
          {t("profile.errors.errorCert.desc")}
        </Alert>
      </Center>
    );
  }
  return (
    <Stack>
      <DownloadBtn cert={cert} type="cert" tickets={[]} />
    </Stack>
  );
};
