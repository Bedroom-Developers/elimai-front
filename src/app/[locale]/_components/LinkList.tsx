import { cn } from "@/lib/utils"

const links = [


    {
        label: 'header.fcelimai',
        href: 'https://fcelimai.kz',
        options: {
            target: '_blank'
        }
    },
    {
        label: 'header.main',
        href: '/'
    },
    {
        label: 'header.profile',
        href: '/profile'
    },

]
type LinkListProps = {
    className?: string
    children: (urls: typeof links) => React.ReactNode
}
export const LinkList = ({ className, children, ...props }: LinkListProps) => {
    return <section className={cn("md:flex items-center gap-4 hidden", className)} {...props}>
        {children(links)}
    </section>

}