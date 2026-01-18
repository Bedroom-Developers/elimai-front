import { RegisterForm } from "@/modules/auth";
import { cookies } from "next/headers";
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
    <section className="flex flex-col items-center justify-center min-h-screen gap-3  ">
      
      <RegisterForm />
    </section>
  );
}
