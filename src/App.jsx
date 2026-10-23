import { useCallback, useEffect, useRef, useState } from "react";
import Controls from "./components/controls/Controls";

const JOINTS = [
  { id: "base", label: "Base" },
  { id: "joint1", label: "Joint 1" },
  { id: "join2", label: "Joint 2" },
  { id: "lamp", label: "Lamp" },
];

const JOINT_RESET_DELAY = 5_000;

function App() {
  const [power, setPower] = useState(false);
  const [color, setColor] = useState("red");
  const [brightness, setBrightness] = useState(100);
  const [brightnessPanelOpen, setBrightnessPanelOpenState] = useState(false);
  const [currentJoint, setCurrentJoint] = useState(null);
  const jointResetTimeoutRef = useRef(null);

  const clearJointResetTimeout = useCallback(() => {
    if (jointResetTimeoutRef.current !== null) {
      window.clearTimeout(jointResetTimeoutRef.current);
      jointResetTimeoutRef.current = null;
    }
  }, []);

  const togglePower = useCallback(() => {
    const nextPower = !power;
    setPower(nextPower);

    if (!nextPower) {
      setBrightnessPanelOpenState(false);
      clearJointResetTimeout();
      setCurrentJoint(null);
    }
  }, [clearJointResetTimeout, power]);

  const changeColor = useCallback((nextColor) => {
    if (power) {
      setColor(nextColor);
    }
  }, [power]);

  const changeBrightness = useCallback((amount) => {
    if (power) {
      setBrightness((currentBrightness) => Math.min(100, Math.max(0, currentBrightness + amount)));
    }
  }, [power]);

  const setBrightnessValue = useCallback((value) => {
    if (power) {
      setBrightness(Math.min(100, Math.max(0, value)));
    }
  }, [power]);

  const setBrightnessPanelOpen = useCallback((open) => {
    setBrightnessPanelOpenState((power && open) || false);
  }, [power]);

  const selectNextJoint = useCallback(() => {
    if (!power) return;

    clearJointResetTimeout();
    setCurrentJoint((selectedJoint) => {
      const currentIndex = JOINTS.findIndex((joint) => joint.id === selectedJoint?.id);
      return JOINTS[(currentIndex + 1) % JOINTS.length];
    });

    jointResetTimeoutRef.current = window.setTimeout(() => {
      setCurrentJoint(null);
      jointResetTimeoutRef.current = null;
    }, JOINT_RESET_DELAY);
  }, [clearJointResetTimeout, power]);

  useEffect(() => clearJointResetTimeout, [clearJointResetTimeout]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement ||
        (event.target instanceof HTMLElement && event.target.isContentEditable)
      ) {
        return;
      }

      if (event.code === "Space") {
        event.preventDefault();
        if (!event.repeat) togglePower();
        return;
      }

      if (!power) return;

      switch (event.key.toLowerCase()) {
        case "1":
          changeColor("red");
          break;
        case "2":
          changeColor("blue");
          break;
        case "3":
          changeColor("green");
          break;
        case "a":
          changeBrightness(-5);
          break;
        case "d":
          changeBrightness(5);
          break;
        case "e":
          if (!event.repeat) selectNextJoint();
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changeBrightness, changeColor, power, selectNextJoint, togglePower]);

  return (
    <Controls
      power={power}
      color={color}
      brightness={brightness}
      brightnessPanelOpen={brightnessPanelOpen}
      currentJoint={currentJoint}
      onPowerToggle={togglePower}
      onColorChange={changeColor}
      onBrightnessChange={setBrightnessValue}
      onBrightnessPanelOpenChange={setBrightnessPanelOpen}
      onNextJoint={selectNextJoint}
    />
  );
}

export default App;
