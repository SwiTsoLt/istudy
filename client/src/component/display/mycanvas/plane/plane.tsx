import React from "react";
import { usePlane } from "@react-three/cannon";
import { useLoader } from "@react-three/fiber";
import { Mesh, TextureLoader } from "three";

export function Plane() {
  const planeTexture = useLoader(TextureLoader, "../media/plane.png");
  const [planeRef] = usePlane<Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [1, -2, -1],
  }));

  return (
    <mesh ref={planeRef} scale={[300, 100, 1]}>
      <planeGeometry args={[10, 10, 1]} />
      <meshStandardMaterial map={planeTexture} />
    </mesh>
  );
}
