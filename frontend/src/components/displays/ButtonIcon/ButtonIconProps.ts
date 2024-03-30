import { ReactNode } from "react";

export interface ButtonIconProps {
    imageSrc?: string,
    heroicon?: ReactNode,
    label: string | null,
    text: string
    callback?: () => void
};
