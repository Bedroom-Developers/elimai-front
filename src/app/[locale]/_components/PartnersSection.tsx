import Image from "next/image";
import Link from "next/link";

const links = [
    { img: "/logonew.png", href: "/" },
    { img: "/it-hub.png", href: "https://www.instagram.com/abai_it?igsh=MWU3MmIyNTdnMG05aQ==" },
    { img: "/abu.png", href: "https://www.instagram.com/bokeikhan_university?igsh=MXBpaG43djVoZ3dxMA==" },
    { img: "/abai-it.png", href: "https://www.instagram.com/abai_it_school?igsh=MWtrOHc2eWkzb2JwOQ==" },
];

export const PartnersSection = () => {
    return (
        <div className="flex flex-wrap justify-center mt-2  items-center gap-2 sm:gap-2.5 pb-2.5 ">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    className="border rounded-full"
                >
                    <Image
                        src={link.img}
                        alt="logo"
                        width={100}
                        height={100}
                        className="h-auto w-[60px] sm:w-[75px] md:w-[100px]"
                    />
                </Link>
            ))}
        </div>
    );
};
