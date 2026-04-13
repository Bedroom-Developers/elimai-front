import { RegisterForm } from "@/modules/auth/ui/forms/RegisterForm";



export default async function RegisterPage() {

  return (
    <section className="flex flex-col items-center justify-center min-h-screen gap-3 px-2 md:px-0">

      <RegisterForm />
    </section>
  );
}
