import { ReactNode } from "react";

export interface ApplicationIconProps {
    imageSrc?: string,
    heroicon?: ReactNode,
    label: string,
    callback?: () => void,
};