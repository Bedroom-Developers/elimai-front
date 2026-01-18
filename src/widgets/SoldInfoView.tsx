"use client";
import { rGetTicketsCount } from "@/shared/api/games";
import { Game, GameStatus } from "@/shared/consts";
import { Alert } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, InfoIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface SoldInfoViewProps {
  game: Game;
}

export const SoldInfoView = ({ game }: SoldInfoViewProps) => {
  const t = useTranslations();

  const { data: ticketsCount, isLoading } = useQuery({
    queryKey: [`tickets count ${game?.id}`],
    queryFn: () => rGetTicketsCount(game.id),
    enabled: !!game?.id,
  });

  if (!game) return null;

  if (game.status === GameStatus[1]) {
    return (
      <Alert
        my={20}
        variant="filled"
        color="elimai.6"
        title={t("alert.near.title")}
        icon={<InfoIcon />}
      >
        {t("alert.near.message")}
      </Alert>
    );
  }

  if (
    !isLoading &&
    game.status === GameStatus[0] &&
    (!ticketsCount?.message || Number(ticketsCount.message) <= 0)
  ) {
    return (
      <Alert
        icon={<AlertTriangle />}
        variant="filled"
        color="red.4"
        my={20}
        title={t("alert.soldout.title")}
      >
        {t("alert.soldout.message")}
      </Alert>
    );
  }

  return null;
};
