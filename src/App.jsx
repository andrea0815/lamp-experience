import Controls from "./components/controls/Controls";
import Scene from "./components/r3f/Scene";
import useLampControls from "./hooks/useLampControls";

export default function App() {
  const lamp = useLampControls();

  return (
    <>
      <Controls
        power={lamp.power}
        color={lamp.color}
        brightness={lamp.brightness}
        brightnessPanelOpen={lamp.brightnessPanelOpen}
        currentJoint={lamp.currentJoint && {
          id: lamp.currentJoint.bone,
          label: lamp.currentJoint.label,
        }}
        onPowerToggle={lamp.togglePower}
        onColorChange={lamp.changeColor}
        onBrightnessChange={lamp.setBrightnessValue}
        onBrightnessPanelOpenChange={lamp.changeBrightnessPanel}
        onNextJoint={lamp.selectNextJoint}
      />
      <Scene
        power={lamp.power}
        color={lamp.color}
        brightness={lamp.brightness}
        jointTargets={lamp.jointTargets}
        selectedJoint={lamp.currentJoint?.bone ?? null}
      />
    </>
  );
}
