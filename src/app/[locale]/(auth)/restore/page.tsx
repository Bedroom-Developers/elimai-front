import { RestoreForm } from "@/features/forms";
import { Stack } from "@mantine/core";
import { getCookie } from "cookies-next/server";
import { cookies } from "next/headers";
import Image from "next/image";

export default async function RestorePage() {
  const hasCode = await getCookie("code-restore", { cookies: cookies });
  return (
    <Stack align="center" justify="center" mih={"100vh"}>
      <Image src="/logonew.png" width={100} height={100} alt="fcelimai logo" />
      <RestoreForm hasCode={!!hasCode} />
    </Stack>
  );
}
