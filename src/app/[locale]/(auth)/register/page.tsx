import { RegisterForm } from "@/features/forms";
import { Stack } from "@mantine/core";
import { getCookie } from "cookies-next/server";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
async function getData() {
  try {
    const res = await getCookie("rg-body", {
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
export default async function RegisterPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const data = await getData();
  console.log(data);
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
