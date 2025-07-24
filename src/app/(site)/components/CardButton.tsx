import { ReactNode } from "react";

type CardButtonProps = {
    children: ReactNode;
    variant?: "primary" | "secondary";
};

export default function CardButton({ children, variant = "primary" }: CardButtonProps) {
    if (variant === "primary") {
        return (
            <button className="
        w-full px-6 py-2 rounded
        bg-primary text-white
        group-hover:bg-alt group-hover:text-primary
        transition-colors duration-200 font-semibold
      ">
                {children}
            </button>
        );
    }
    return (
        <button className="
      w-full px-6 py-2 rounded border-2
      bg-white text-primary border-primary
      group-hover:bg-primary group-hover:text-alt group-hover:border-alt
      transition-colors duration-200 font-semibold
    ">
            {children}
        </button>
    );
}
