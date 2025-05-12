import { ConfirmForm } from "@/features/forms/ConfirmForm";
import { Stack } from "@mantine/core";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

async function getData(mode: string) {
  try {
    const cookieStore = cookies();
    const cookieKey = mode === "register" ? "rg-body" : "rs-body";
    const res = cookieStore.get(cookieKey);

    if (!res?.value) {
      throw new Error("No cookie");
    }

    const parsed = JSON.parse(res.value);
    return parsed;
  } catch (e) {
    console.error("Failed to get or parse cookie:", e);
    return null;
  }
}

export default async function VerifyPage({
  params: { action, locale },
}: {
  params: { action: string; locale: string };
}) {
  const data = await getData(action);

  if (!data) {
    return redirect(`/${locale}/login`);
  }

  return (
    <Stack align="center" justify="center" mih="100vh">
      <Image src="/logonew.png" width={100} height={100} alt="fcelimai logo" />
      <ConfirmForm userData={data} mode={action as "restore" | "register"} />
    </Stack>
  );
}
