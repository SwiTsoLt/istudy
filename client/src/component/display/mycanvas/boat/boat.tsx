import { Suspense } from 'react'
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export function Boat() {
  const gltf = useLoader(GLTFLoader, "../models/boat/scene.gltf");

  return (
    <primitive object={gltf.scene} position={[ -15, 0, 26 ]} scale={[0.2, 0.2, 0.2]} />
  );
}
