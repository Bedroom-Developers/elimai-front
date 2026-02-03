import { EventsView } from "@/modules/events/ui/components/EventsView";
import { HeroSection } from "@/widgets";

export default function HomePage() {
  return (
    <section>
      <HeroSection />
      <EventsView />
    </section>
  );
}
