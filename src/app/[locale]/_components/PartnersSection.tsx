import Link from "next/link";

const links = [
    { img: "/logonew.png", href: "/" },
    { img: "/it-hub.png", href: "https://www.instagram.com/abai_it?igsh=MWU3MmIyNTdnMG05aQ==" },
    { img: "/kaz_logo.svg", href: "https://www.kazminerals.com/ru/" }


];

export const PartnersSection = () => {
    return (
        <div className="flex flex-wrap justify-center mt-2  items-center gap-3   md:gap-5 lg:gap-10  pb-2.5 ">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    target="_blank"
                >
                    <img
                        src={link.img}
                        alt="logo"
                        className="w-[60px] sm:w-[75px] md:w-[100px] h-auto"
                    />
                </Link>
            ))}
        </div>
    );
};
