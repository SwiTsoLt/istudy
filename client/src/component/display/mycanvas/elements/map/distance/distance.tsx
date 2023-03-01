// @ts-ignore
import { Text } from "troika-three-text";
import { extend } from "@react-three/fiber";
extend({ Text });

export function Distance() {
  const text = "         45km\n<———————>";

  const options = {
    font: "Orbitron",
    fontSize: 0.2,
    color: "#606050",
    maxWidth: 300,
    lineHeight: 1,
    letterSpacing: 0,
    textAlign: "justify",
    materialType: "MeshPhongMaterial",
  };

  return (
    <text
      text={text}
      position-x={-1.9}
      position-y={13}
      position-z={9.2}
      rotation={[0.3, 3, 0.8]}
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
