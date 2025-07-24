import { ReactNode } from "react";
import Link from "next/link";

type CardButtonProps = {
    children: ReactNode;
    variant?: "primary" | "secondary";
    href?: string;
};

export default function CardButton({
    children,
    variant = "primary",
    href,
}: CardButtonProps) {
    const baseClass =
        "w-full px-6 py-2 rounded transition-colors duration-200 font-semibold";
    const primary =
        "bg-primary text-white group-hover:bg-alt group-hover:text-primary";
    const secondary =
        "bg-white text-primary border-2 border-primary group-hover:bg-primary group-hover:text-alt group-hover:border-alt";

    if (href) {
        return (
            <Link
                href={href}
                className={`
                    ${baseClass}
                    ${variant === "primary" ? primary : secondary}
                    flex items-center justify-center
                    text-center
                `}
            >
                {children}
            </Link>
        );
    }
    return (
        <button
            className={`
                ${baseClass}
                ${variant === "primary" ? primary : secondary}
            `}
        >
            {children}
        </button>
    );
}
