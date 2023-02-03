import React, { useEffect } from "react";
import { Mesh, TextureLoader } from "three";
import { useSphere } from "@react-three/cannon";
import { useLoader } from "@react-three/fiber";

export function Sphere() {
  const sphereTexture = useLoader(TextureLoader, "../media/ball.jpg");

  const [sphereRef] = useSphere<Mesh>(() => ({}));
  return (
    <mesh ref={sphereRef}>
      <sphereGeometry />
      <meshStandardMaterial map={sphereTexture} />
    </mesh>
  );
}
