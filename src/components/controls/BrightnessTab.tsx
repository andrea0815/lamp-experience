type Props = {
    brightness: number;
    open?: boolean;
    onChange: (value: number) => void;
    onPointerEnter: () => void;
    onPointerLeave: () => void;
    disabled?: boolean;
};

function BrightnessTab({
    brightness,
    open = false,
    onChange,
    onPointerEnter,
    onPointerLeave,
    disabled = false,
}: Props) {
    return (
        <div
            className={`absolute bottom-full left-0 z-20 mb-1 w-[120px]
                text-beige-400 transition-opacity duration-300 ease-in-out
                ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            aria-hidden={!open}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
        >
            <input
                id="brightness-slider"
                aria-label="Brightness"
                type="range"
                disabled={disabled}
                min={0}
                max={100}
                step={1}
                value={brightness}
                tabIndex={open ? 0 : -1}
                onChange={(event) =>
                    onChange(Number(event.currentTarget.value))
                }
                className="brightness-slider"
            />
        </div>
    );
}

export default BrightnessTab;
