import { ConfirmForm } from "@/features/forms/ConfirmForm";
import { Stack } from "@mantine/core";
import { getCookie } from "cookies-next/server";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
async function getData(mode: string) {
  try {
    const res = await getCookie(mode == "register" ? "rg-body" : "rs-body", {
      cookies: cookies,
    });
    try {
      if (!res) {
        throw new Error("No cookie");
      }
      const parsed = JSON.parse(res);
      return parsed;
    } catch (e) {
      throw new Error("parse failed");
    }
    return res;
  } catch (e) {
    console.log(e);
    return null;
  }
}
export default async function VerifyPage({
  params: { action, locale },
}: {
  params: { action: string; locale: string };
}) {
  const data = await getData(action);
  console.log(data);
  if (!data) return redirect(`/${locale}/login`);
  return (
    <Stack align="center" justify="center" mih={"100vh"}>
      <Image src="/logonew.png" width={100} height={100} alt="fcelimai logo" />
      <ConfirmForm userData={data} mode={action as "restore" | "register"} />
    </Stack>
  );
}
