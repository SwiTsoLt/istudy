import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { Plane } from "./plane/plane";
import { Sphere } from "./sphere/sphere";

interface ICanvasProps {
    webSocket: WebSocket | null
}

export function MyCanvas(props: ICanvasProps) {
  return (
    <Suspense>
      <Canvas>
        <Physics>
          <ambientLight intensity={0.1} />
          <pointLight position={[10, 10, 10]} />
          <Plane webSocket={props.webSocket} />
          <Sphere />
        </Physics>
      </Canvas>
    </Suspense>
  );
}
