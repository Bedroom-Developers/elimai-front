import { RegisterForm } from "@/modules/auth";



export default async function RegisterPage() {

  return (
    <section className="flex flex-col items-center justify-center min-h-screen gap-3  ">
      
      <RegisterForm />
    </section>
  );
}
