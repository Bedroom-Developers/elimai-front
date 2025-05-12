import { ConfirmForm } from "@/features/forms/ConfirmForm";
import { Stack } from "@mantine/core";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
async function getData(mode: string) {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_FRONT_URL + `/nextapi/confirm?id=${mode}`,
      {
        headers: {
          Cookie: cookies().toString(),
        },
        cache: "no-store",
      },
    );

    if (res.ok) {
      return res.json();
    }
  } catch (e) {
    console.log(e);
  }

  return null;
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
