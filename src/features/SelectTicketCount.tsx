"use client";
import { rGetUserTicketLimit } from "@/shared/api/games";
import { Select, Skeleton, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useQuery } from "react-query";
type valueType = { value: string; disabled: boolean };
interface SelectTicketCountProps {
  gameId: number;
  value: string;
  remaining: number;
  onChange: (value: string | null) => void;
  error?: string;
}
export const SelectTicketCount = ({
  gameId,
  value,
  remaining,
  onChange,
  error,
}: SelectTicketCountProps) => {
  const t = useTranslations();
  const { data: buyed, isLoading } = useQuery({
    queryKey: [`user limit ${gameId}`],
    queryFn: async () => {
      const { message } = await rGetUserTicketLimit(gameId);
      return message;
    },
  });
  if (isLoading) return <Skeleton width={"100%"} height={60} />;
  if (!buyed) return null;
  if (buyed == "3") {
    return <Text c="rose.5">{t("buy.max")}</Text>;
  }
  const options = new Array(3).fill("*").map((_, idx) => {
    const value = `${idx + 1}`;
    return {
      value: value,
      label: value,
      disabled: idx + 1 + parseInt(buyed) >= 4 || idx + 1 > remaining,
    };
  });
  return (
    <Select
      styles={{
        dropdown: {
          border: "1px solid var(--mantine-color-slate-4)",
        },
        option: {
          backgroundColor: "var(--mantine-color-slate-2)",
          margin: "5px 0",
        },
      }}
      checkIconPosition="right"
      disabled={buyed == "3"}
      error={error}
      comboboxProps={{
        transitionProps: { transition: "pop", duration: 200 },
        shadow: "xl",
      }}
      label={t("buy.form.select")}
      placeholder={t("buy.form.select")}
      data={options}
      value={value}
      onChange={onChange}
    />
  );
};
