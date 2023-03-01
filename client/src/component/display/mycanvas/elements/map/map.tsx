import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { Distance } from "./distance/distance";

export function Map() {
  const [mapTexture] = useLoader(TextureLoader, ["../media/map.jpg"]);

  return (
    <>
      <mesh position={[-2, 12, 10]} rotation={[30, 0, 0]}>
        <planeGeometry args={[3.5, 3]} />
        <meshStandardMaterial map={mapTexture} />
      </mesh>
      <Distance />
    </>
  );
}
