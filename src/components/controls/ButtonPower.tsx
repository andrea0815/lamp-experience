
type ButtonPowerProps = {
    active?: boolean;
    onClick: () => void;
};

export default function ButtonPower({
    active = false,
    onClick,
}: ButtonPowerProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            aria-label="Toggle lamp power"
            className={`control-button relative h-full w-auto shrink-0 aspect-[94/56] border-0 p-0 bg-transparent cursor-pointer ${active ? "control-button--active" : ""}`}
        >
            <div className="w-full h-full flex items-center justify-center pointer-events-none">

                <svg
                    className="block h-full w-full min-w-0 overflow-visible"
                    viewBox="0 0 94 56"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M93.3969 28L65.5 56H27.8969L-5.72205e-06 28L27.8969 0H65.5L93.3969 28Z" vectorEffect="non-scaling-stroke" strokeWidth="2" fillRule="evenodd" clipRule="evenodd" />
                    <path d="M93.3969 28L65.5 56H27.8969L-5.72205e-06 28L27.8969 0H65.5L93.3969 28Z" vectorEffect="non-scaling-stroke" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M53.365 22.6399C54.6234 23.8987 55.4802 25.5023 55.8273 27.2481C56.1743 28.9938 55.9959 30.8033 55.3146 32.4476C54.6334 34.092 53.4798 35.4974 51.9998 36.4862C50.5198 37.475 48.7799 38.0028 47 38.0028C45.2201 38.0028 43.4802 37.475 42.0002 36.4862C40.5202 35.4974 39.3666 34.092 38.6854 32.4476C38.0041 30.8033 37.8257 28.9938 38.1727 27.2481C38.5197 25.5023 39.3766 23.8987 40.635 22.6399" vectorEffect="non-scaling-stroke" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" />
                    <path d="M47.005 18V28" vectorEffect="non-scaling-stroke" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" />
                </svg>

            </div>
        </button>
    );
}
