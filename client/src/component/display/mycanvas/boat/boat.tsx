import { Suspense } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Speedometer } from "../elements/speedometer/speedometer";
import { Clock } from "../elements/speedometer/clock/clock";

export function Boat() {
  const gltf = useLoader(GLTFLoader, "../models/boat/scene.gltf");

  return (
    <>
      <primitive
        object={gltf.scene}
        position={[-15, 0, 30]}
        scale={[0.2, 0.2, 0.2]}
      />
      <Speedometer />
      <Clock />
    </>
  );
}
