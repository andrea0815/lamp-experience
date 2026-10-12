import ButtonValue from "./ButtonValue";
import ButtonWrapper from "./ButtonWrapper";

type Joint = {
    id: string;
    label: string;
};

type JointControlProps = {
    currentJoint: Joint | null;
    disabled?: boolean;
    onNextJoint: () => void;
};

export default function JointControl({
    currentJoint,
    disabled = false,
    onNextJoint,
}: JointControlProps) {
    return (
        <ButtonWrapper disabled={disabled} midSection={false} padding="5px 8px" keys={["E"]}>
            <ButtonValue
                active={currentJoint !== null}
                ariaLabel={currentJoint ? `Current joint: ${currentJoint.label}` : "Select joint"}
                disabled={disabled}
                onClick={onNextJoint}
            >
                <p>{currentJoint?.label ?? "Joint"}</p>
            </ButtonValue>
        </ButtonWrapper>
    );
}
