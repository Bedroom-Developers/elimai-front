import { RegisterForm } from "@/features/forms";
import { Stack } from "@mantine/core";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

async function getData() {
  try {
    const cookieStore = cookies();
    const res = cookieStore.get("rg-body");

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

export default async function RegisterPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const data = await getData();

  if (data) {
    return redirect(`/${locale}/verify/register`);
  }

  return (
    <Stack align="center" justify="center" mih="100vh">
      <Image
        src="/logonew.png"
        width={100}
        height={100}
        priority={true}
        alt="fcelimai logo"
      />
      <RegisterForm />
    </Stack>
  );
}
