import type { ReactNode } from "react";

type ButtonValueProps = {
    children: ReactNode;
    active?: boolean;
    disabled?: boolean;
    ariaLabel: string;
    onClick: () => void;
};

export default function ButtonValue({
    children,
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
            className={`control-button relative flex-1 min-w-0 h-full border-0 p-0 bg-transparent cursor-pointer disabled:cursor-default ${active ? "control-button--active" : ""}`}
        >
            <div className="absolute inset-0 z-10 flex items-center justify-center text-center tracking-wider font-smythe text-creme">
                {children}
            </div>

            <div className="w-full h-full flex pointer-events-none">
                <svg className="block h-full w-auto shrink-0 aspect-[31/57]" width="31" height="57" viewBox="0 0 31 57" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M172.155 0.75L199.829 28.4238L172.155 56.0986H28.7344L1.05957 28.4238L28.7344 0.75H172.155Z" vectorEffect="non-scaling-stroke" strokeWidth="2" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

                <svg className="block h-full min-w-0 flex-1 overflow-visible" preserveAspectRatio="none" width="31" height="57" viewBox="0 0 31 57" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M138.155 0.75L165.829 28.4238L138.155 56.0986H-5.26562L-32.9404 28.4238L-5.26562 0.75H138.155Z" vectorEffect="non-scaling-stroke" strokeWidth="2" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

                <svg className="block h-full w-auto shrink-0 aspect-[31/57] rotate-180" width="31" height="57" viewBox="0 0 31 57" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M172.155 0.75L199.829 28.4238L172.155 56.0986H28.7344L1.05957 28.4238L28.7344 0.75H172.155Z" vectorEffect="non-scaling-stroke" strokeWidth="2" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </button>
    );
}
