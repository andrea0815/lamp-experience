import type { ReactNode } from "react";

type ButtonValueProps = {
    children: ReactNode;
    active?: boolean;
    disabled?: boolean;
    width?: string;
    ariaLabel: string;
    onClick: () => void;
};

export default function ButtonValue({
    children,
    width,
    active = false,
    disabled = false,
    ariaLabel,
    onClick,
}: ButtonValueProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-pressed={active}
            aria-label={ariaLabel}
            style={{ width }}
            className={`control-button relative flex-1 min-w-0 h-full border-0 p-0 bg-transparent cursor-pointer disabled:cursor-default ${active ? "control-button--active" : ""}`}
        >
            <div className="absolute inset-0 z-10 flex items-center justify-center text-center tracking-wider font-smythe text-creme">
                {children}
            </div>

            <div className="flex h-full w-full pointer-events-none">
                <svg className="block h-full w-auto shrink-0 aspect-[28/56]" viewBox="0 0 28 56" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M28 1L1 28L28 55" vectorEffect="non-scaling-stroke" strokeWidth="2" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

                <svg className="block h-full min-w-0 flex-1 overflow-visible" viewBox="0 0 120 56" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M0 1H120M0 55H120" vectorEffect="non-scaling-stroke" strokeWidth="2" strokeLinecap="round" />
                </svg>

                <svg className="block h-full w-auto shrink-0 aspect-[28/56]" viewBox="0 0 28 56" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M0 1L27 28L0 55" vectorEffect="non-scaling-stroke" strokeWidth="2" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </button>
    );
}
