import { useCallback, useEffect, useRef } from "react";
import IconBrightness from "../svgs/IconBrightness";
import BrightnessTab from "./BrightnessTab";
import ButtonValue from "./ButtonValue";
import ButtonWrapper from "./ButtonWrapper";

type BrightnessControlProps = {
    brightness: number;
    disabled?: boolean;
    open: boolean;
    onBrightnessChange: (value: number) => void;
    onOpenChange: (open: boolean) => void;
};

export default function BrightnessControl({
    brightness,
    disabled = false,
    open,
    onBrightnessChange,
    onOpenChange,
}: BrightnessControlProps) {
    const controlRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<number | null>(null);

    const clearCloseTimeout = useCallback(() => {
        if (timeoutRef.current !== null) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const startCloseTimeout = useCallback(() => {
        clearCloseTimeout();
        timeoutRef.current = window.setTimeout(() => {
            onOpenChange(false);
            timeoutRef.current = null;
        }, 1200);
    }, [clearCloseTimeout, onOpenChange]);

    useEffect(() => {
        if (!open) return;

        startCloseTimeout();

        function handleOutsideClick(event: PointerEvent) {
            if (
                event.target instanceof Node &&
                !controlRef.current?.contains(event.target)
            ) {
                onOpenChange(false);
            }
        }

        document.addEventListener("pointerdown", handleOutsideClick);
        return () => {
            clearCloseTimeout();
            document.removeEventListener("pointerdown", handleOutsideClick);
        };
    }, [clearCloseTimeout, onOpenChange, open, startCloseTimeout]);

    useEffect(() => {
        if (disabled && open) {
            onOpenChange(false);
        }
    }, [disabled, onOpenChange, open]);

    return (
        <div ref={controlRef} className="relative">
            <BrightnessTab
                brightness={brightness}
                disabled={disabled}
                open={open}
                onChange={onBrightnessChange}
                onPointerEnter={clearCloseTimeout}
                onPointerLeave={startCloseTimeout}
            />

            <ButtonWrapper disabled={disabled} midSection={false} padding="5px 8px" keys={["A", "D"]}>
                <div className="ml-2 mr-1 w-4" aria-hidden="true">
                    <IconBrightness />
                </div>

                <ButtonValue
                    active={open}
                    ariaLabel={`Brightness: ${brightness}%`}
                    disabled={disabled}
                    onClick={() => onOpenChange(!open)}
                >
                    <p>{brightness}%</p>
                </ButtonValue>
            </ButtonWrapper>
        </div>
    );
}
