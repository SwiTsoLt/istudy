import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { SpeedometrLine } from "./speedometrLine/speedometrLine";

export function Speedometer() {
  const [speedometrTexture] = useLoader(TextureLoader, [
    "../media/speedometr.jpg",
  ]);

  return (
    <>
      <mesh position={[3, 13, -4]}>
        <circleGeometry args={[1, 32]} />
        <meshStandardMaterial map={speedometrTexture} />
      </mesh>
      <SpeedometrLine />
    </>
  );
}
