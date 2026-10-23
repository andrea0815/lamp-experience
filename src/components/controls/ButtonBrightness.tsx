import type { ReactNode } from "react";

type ButtonBrightnessProps = {
    children: ReactNode;
    active?: boolean;
    disabled?: boolean;
    ariaLabel: string;
    onClick: () => void;
};

export default function ButtonBrightness({
    children,
    active = false,
    disabled = false,
    ariaLabel,
    onClick,
}: ButtonBrightnessProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-pressed={active}
            aria-label={ariaLabel}
            className={`control-button relative flex-1 min-w-0 h-full border-0 p-0 bg-transparent cursor-pointer disabled:cursor-default ${active ? "control-button--active" : ""}`}
        >
            <div className="absolute inset-0 z-10 flex items-center justify-center text-center tracking-wider font-smythe text-creme">
                {children}
            </div>

            <svg className="block h-full w-full overflow-visible pointer-events-none" viewBox="0 0 120 56" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M28 1H92L119 28L92 55H28L1 28L28 1Z" vectorEffect="non-scaling-stroke" strokeWidth="2" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>
    );
}
