import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";

export interface ILineProps {
  start: number[];
  end: number[];
  isGrab: boolean
}

export function Line(props: ILineProps) {
  const ref = useRef<any>();
  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.geometry.setFromPoints(
        [props.start, props.end].map((point) => new THREE.Vector3(...point))
      );
    }
  }, [props.start, props.end]);
  return (
    <line ref={ref}>
      <bufferGeometry />
      <lineBasicMaterial color={props.isGrab ? "green" : "red"} />
    </line>
  );
}
