import React, { useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export function SpeedometrLine() {

  return (
    <mesh position={[2.9, 13.3, -4]} rotation={[0, 0, 2]}>
      <planeGeometry args={[0.8, 0.04]} />
      <meshBasicMaterial color={"#aa0000"} />
    </mesh>
  );
}
