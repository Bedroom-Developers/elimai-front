import { RestoreForm } from "@/modules/auth";



export default async function RestorePage() {

  return (
    <section className="flex flex-col items-center justify-center min-h-screen">
      <RestoreForm/>
    </section>
  );
}
