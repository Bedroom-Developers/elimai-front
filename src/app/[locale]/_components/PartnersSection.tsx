import Link from "next/link";
import Image from "next/image";

const links = [
    { img: "/abai.png", href: "#", alt: "Abai" },
    { img: "/kaz_logo.svg", href: "https://www.kazminerals.com/ru/", alt: "Kaz Minerals" },
    { img: "/logonew.png", href: "/", alt: "FC Elimai" },
    { img: "/it-hub.png", href: "https://www.instagram.com/abai_it?igsh=MWU3MmIyNTdnMG05aQ==", alt: "IT Hub" },

];

export const PartnersSection = () => {
    return (
        <div className="flex flex-wrap justify-center mt-2  items-center gap-3   md:gap-5 lg:gap-10  pb-2.5 ">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                    <Image
                        src={link.img}
                        alt={link.alt}
                        width={100}
                        height={100}
                        sizes="(max-width: 640px) 60px, (max-width: 768px) 75px, 100px"
                        className="w-[60px] sm:w-[75px] md:w-[100px] h-auto"
                    />
                </Link>
            ))}
        </div>
    );
};
