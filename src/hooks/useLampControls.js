import { useCallback, useEffect, useRef, useState } from "react";
import {
  CONTROLLABLE_JOINTS,
  JOINT_SELECTION_TIMEOUT_MS,
} from "../config/lamp";

const MIN_BRIGHTNESS = 10;
const JOINT_ACCELERATION = 150;
const JOINT_MAX_SPEED = 120;
const JOINT_DECELERATION = 200;

export default function useLampControls() {
  const [power, setPower] = useState(false);
  const [color, setColor] = useState("red");
  const [brightness, setBrightness] = useState(100);
  const [brightnessPanelOpen, setBrightnessPanelOpen] = useState(false);
  const [currentJoint, setCurrentJoint] = useState(null);
  const [jointTargets, setJointTargets] = useState(() =>
    Object.fromEntries(CONTROLLABLE_JOINTS.map((joint) => [joint.bone, joint.initial]))
  );
  const keysPressed = useRef({ w: false, s: false });
  const jointVelocity = useRef(0);
  const selectionTimeout = useRef(null);

  const clearSelectionTimer = useCallback(() => {
    window.clearTimeout(selectionTimeout.current);
    selectionTimeout.current = null;
  }, []);

  const refreshSelectionTimer = useCallback(() => {
    clearSelectionTimer();
    selectionTimeout.current = window.setTimeout(
      () => setCurrentJoint(null),
      JOINT_SELECTION_TIMEOUT_MS,
    );
  }, [clearSelectionTimer]);

  const togglePower = useCallback(() => {
    setPower((currentPower) => {
      if (currentPower) {
        setBrightnessPanelOpen(false);
        setCurrentJoint(null);
        clearSelectionTimer();
      }
      return !currentPower;
    });
  }, [clearSelectionTimer]);

  const changeColor = useCallback((nextColor) => {
    if (power) setColor(nextColor);
  }, [power]);

  const changeBrightness = useCallback((amount) => {
    if (!power) return;
    setBrightness((value) => Math.min(100, Math.max(MIN_BRIGHTNESS, value + amount)));
  }, [power]);

  const setBrightnessValue = useCallback((value) => {
    if (power) setBrightness(Math.min(100, Math.max(MIN_BRIGHTNESS, value)));
  }, [power]);

  const changeBrightnessPanel = useCallback((open) => {
    setBrightnessPanelOpen(power && open);
  }, [power]);

  const selectNextJoint = useCallback(() => {
    if (!power) return;
    setCurrentJoint((selected) => {
      const index = CONTROLLABLE_JOINTS.findIndex((joint) => joint.bone === selected?.bone);
      return CONTROLLABLE_JOINTS[(index + 1) % CONTROLLABLE_JOINTS.length];
    });
    refreshSelectionTimer();
  }, [power, refreshSelectionTimer]);

  const rotateCurrentJoint = useCallback((amount) => {
    if (!power || !currentJoint) return;
    setJointTargets((targets) => {
      const nextValue = targets[currentJoint.bone] + amount;
      return {
        ...targets,
        [currentJoint.bone]: currentJoint.isLooping
          ? nextValue
          : Math.min(currentJoint.max, Math.max(currentJoint.min, nextValue)),
      };
    });
    refreshSelectionTimer();
  }, [currentJoint, power, refreshSelectionTimer]);

  useEffect(() => {
    jointVelocity.current = 0;
    keysPressed.current = { w: false, s: false };
  }, [currentJoint, power]);

  useEffect(() => {
    let frameId;
    let lastTime = performance.now();
    const animate = (time) => {
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      const direction = Number(keysPressed.current.w) - Number(keysPressed.current.s);
      let velocity = jointVelocity.current;

      if (direction) {
        velocity = Math.max(-JOINT_MAX_SPEED, Math.min(JOINT_MAX_SPEED, velocity + direction * JOINT_ACCELERATION * delta));
      } else {
        const slowdown = JOINT_DECELERATION * delta;
        velocity = Math.abs(velocity) <= slowdown ? 0 : velocity - Math.sign(velocity) * slowdown;
      }

      jointVelocity.current = velocity;
      if (velocity) rotateCurrentJoint(velocity * delta);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [rotateCurrentJoint]);

  useEffect(() => {
    const isEditing = (target) => target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement || (target instanceof HTMLElement && target.isContentEditable);
    const handleKeyDown = (event) => {
      if (isEditing(event.target)) return;
      if (event.code === "Space") {
        event.preventDefault();
        if (!event.repeat) togglePower();
        return;
      }
      if (!power) return;

      const key = event.key.toLowerCase();
      if (key === "1") changeColor("red");
      if (key === "2") changeColor("blue");
      if (key === "3") changeColor("green");
      if (key === "a") changeBrightness(-5);
      if (key === "d") changeBrightness(5);
      if (key === "e" && !event.repeat) selectNextJoint();
      if ((key === "w" || key === "s") && currentJoint) {
        event.preventDefault();
        keysPressed.current[key] = true;
        refreshSelectionTimer();
      }
    };
    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase();
      if (key === "w" || key === "s") keysPressed.current[key] = false;
    };
    const stopMovement = () => { keysPressed.current = { w: false, s: false }; };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", stopMovement);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", stopMovement);
    };
  }, [changeBrightness, changeColor, currentJoint, power, refreshSelectionTimer, selectNextJoint, togglePower]);

  useEffect(() => clearSelectionTimer, [clearSelectionTimer]);

  return {
    power,
    color,
    brightness,
    brightnessPanelOpen,
    currentJoint,
    jointTargets,
    togglePower,
    changeColor,
    setBrightnessValue,
    changeBrightnessPanel,
    selectNextJoint,
  };
}
