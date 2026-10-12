
type ButtonColorProps = {
    color: "yellow" | "purple" | "aqua";
    active?: boolean;
    onClick: () => void;
    disabled?: boolean;
};

const swatchColor = {
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    aqua: "bg-aqua-500",
};

export default function ButtonColor({
    color,
    active = false,
    onClick,
    disabled = false,
}: ButtonColorProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-pressed={active}
            aria-label={`Select ${color} light`}
            className={`control-button relative flex h-full w-auto shrink-0 aspect-[78/56] items-center justify-center border-0 p-0 bg-transparent cursor-pointer disabled:cursor-default ${active ? "control-button--active" : ""}`}
        >
            <svg className="block h-full w-full overflow-visible pointer-events-none" width="78" height="56" viewBox="0 0 78 56" xmlns="http://www.w3.org/2000/svg">
                <path transform="translate(5.3 0)" d="M39.085 1L65.9844 28L39.085 55H28.3125L1.41113 28L28.3125 1H39.085Z" stroke="customColor" vectorEffect="non-scaling-stroke" strokeWidth="2" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <span className="absolute inset-0 grid place-items-center pointer-events-none">
                <span className="relative grid h-[55%] aspect-[78/56] place-items-center">
                    <svg className="color-swatch-outline absolute inset-0 block h-full w-full overflow-visible" viewBox="0 0 78 56" aria-hidden="true">
                        <path transform="translate(5.3 0)" d="M39.085 1L65.9844 28L39.085 55H28.3125L1.41113 28L28.3125 1H39.085Z" vectorEffect="non-scaling-stroke" strokeWidth="1.5" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className={`relative block size-3 rotate-45 ${swatchColor[color]}`} />
                </span>
            </span>
        </button>
    );
}
