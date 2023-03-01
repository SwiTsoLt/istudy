import { Suspense } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Speedometer } from "../elements/speedometer/speedometer";
import { Clock } from "../elements/clock/clock";
import { Map } from "../elements/map/map";

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
      <Map />
    </>
  );
}
