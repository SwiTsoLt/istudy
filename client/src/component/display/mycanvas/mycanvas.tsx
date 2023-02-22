import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { Plane } from "./plane/plane";
import { Sphere } from "./sphere/sphere";
import { Hand } from "./hand/hand";
import { Line } from "./line/line";
import { Boat } from "./boat/boat";

interface ICanvasProps {
  webSocket: WebSocket | null;
  handPos: number[];
  isGrab: boolean;
}

export function MyCanvas(props: ICanvasProps) {
  return (
    <Suspense>
      <Canvas>
        <Physics>
          <ambientLight intensity={0.1} />
          <pointLight position={[1, 40, 10]} />
          <Plane webSocket={props.webSocket} />
          {/* <Sphere /> */}
          <Line
            start={[
              (8 - props.handPos[0] / 40) / 3,
              (6 - props.handPos[1] / 50) / 3,
              1,
            ]}
            end={[10 - props.handPos[0] / 30, 8 - props.handPos[1] / 40, 1]}
            isGrab={props.isGrab}
          />
          <Hand handPos={props.handPos} isGrab={props.isGrab} />
          <Boat />
        </Physics>
      </Canvas>
    </Suspense>
  );
}
