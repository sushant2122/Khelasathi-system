import { Spinner } from "flowbite-react";

export enum LoadingSize {
    XS = "xs",
    SM = "sm",
    MD = "md",
    LG = "lg",
    XL = "xl"
}

interface LoadingComponentsProps {
    size: LoadingSize;
    className?: string;
}

const LoadingComponents: React.FC<LoadingComponentsProps> = ({ size, className = "" }) => {
    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            <div className="text-center">
                <Spinner aria-label="Center-aligned spinner" size={size} />
            </div>
        </div>
    );
};

export default LoadingComponents;