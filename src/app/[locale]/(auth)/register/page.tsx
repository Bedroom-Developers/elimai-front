import { RegisterForm } from "@/features/forms";
import { Stack } from "@mantine/core";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
async function getData() {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_FRONT_URL + "/api/confirm?id=register",
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
  } catch (e) {}

  return null;
}
export default async function RegisterPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const data = await getData();
  if (data) return redirect(`/${locale}/verify/register`);
  return (
    <Stack align="center" justify="center" mih={"100vh"}>
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
