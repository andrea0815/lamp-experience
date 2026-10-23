import BrightnessControl from "./BrightnessControl";
import ButtonColor from "./ButtonColor";
import ButtonPower from "./ButtonPower";
import ButtonWrapper from "./ButtonWrapper";
import JointControl from "./JointControl";

type Color = "red" | "blue" | "green";

type Joint = {
    id: string;
    label: string;
};

type ControlsProps = {
    power: boolean;
    color: Color;
    brightness: number;
    brightnessPanelOpen: boolean;
    currentJoint: Joint | null;
    onPowerToggle: () => void;
    onColorChange: (color: Color) => void;
    onBrightnessChange: (brightness: number) => void;
    onBrightnessPanelOpenChange: (open: boolean) => void;
    onNextJoint: () => void;
};

export default function Controls({
    power,
    color,
    brightness,
    brightnessPanelOpen,
    currentJoint,
    onPowerToggle,
    onColorChange,
    onBrightnessChange,
    onBrightnessPanelOpenChange,
    onNextJoint,
}: ControlsProps) {
    return (
        <>
            <div className="flex gap-4 fixed bottom-3 left-5">
                <ButtonWrapper midSection padding="5px 8px" keys={["Space"]}>
                    <ButtonPower active={power} onClick={onPowerToggle} />
                </ButtonWrapper>

                <ButtonWrapper disabled={!power} midSection={false} padding="5px 8px" keys={["1", "2", "3"]}>
                    <ButtonColor color="yellow" active={color === "red"} disabled={!power} onClick={() => onColorChange("red")} />
                    <ButtonColor color="purple" active={color === "blue"} disabled={!power} onClick={() => onColorChange("blue")} />
                    <ButtonColor color="aqua" active={color === "green"} disabled={!power} onClick={() => onColorChange("green")} />
                </ButtonWrapper>

                <BrightnessControl
                    brightness={brightness}
                    disabled={!power}
                    open={brightnessPanelOpen}
                    onBrightnessChange={onBrightnessChange}
                    onOpenChange={onBrightnessPanelOpenChange}
                />
            </div>

            <div className="fixed top-3 left-5">
                <JointControl
                    currentJoint={currentJoint}
                    disabled={!power}
                    onNextJoint={onNextJoint}
                />
            </div>
        </>
    );
}
