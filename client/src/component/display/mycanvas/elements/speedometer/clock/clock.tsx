// @ts-ignore
import { Text } from "troika-three-text";
import { extend } from "@react-three/fiber";
extend({ Text });

export function Clock() {
  const text = "12:00";

  const options = {
    font: "Orbitron",
    fontSize: 0.4,
    color: "#ffffff",
    maxWidth: 300,
    lineHeight: 1,
    letterSpacing: 0,
    textAlign: "justify",
    materialType: "MeshPhongMaterial",
  };

  return (
    <text
      text={text}
      position-x={-2}
      position-y={13}
      position-z={-4}
      {...options}
      //@ts-ignore
      anchorX={"center"}
      //@ts-ignore
      anchorY={"middle"}
      //@ts-ignore
      font={
        "https://fonts.gstatic.com/s/orbitron/v25/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nyGy6BoWgz.woff2"
      }
    >
      <meshPhongMaterial attach="material" color={"#ffffff"} />
    </text>
  );
}
