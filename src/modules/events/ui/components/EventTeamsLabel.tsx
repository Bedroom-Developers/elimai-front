import { Event } from "@/shared/api/generated";
import { cn } from "@/shared/lib/utils";
import { useLocale } from "next-intl";
import { getEventTeams } from "../../utils";

interface EventTeamsLabelProps extends React.HTMLAttributes<HTMLDivElement> {
    event: Event
    separatorClassName?: string
}
export const EventTeamsLabel = ({ event, className, separatorClassName, ...props }: EventTeamsLabelProps) => {
    const locale = useLocale();
    const { elimai, enemy } = getEventTeams(event, locale);
    return <div className={cn("flex flex-col gap-1 md:flex-row w-full ", className)} {...props}><span>{elimai}</span> <span className={cn("hidden md:block", separatorClassName)}>—</span> <span>{enemy}</span></div>
}
