import React, { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { Plane } from "./plane/plane";
import { Sphere } from "./sphere/sphere";
import { Hand } from "./hand/hand";
import { Line } from "./line/line";
import { Boat } from "./boat/boat";
import * as ws from "../../../hook/ws.hook";

interface ICanvasProps {
  webSocket: WebSocket | null;
  handPos: number[];
  isGrab: boolean;
}

interface IPosition {
  x: number;
  y: number;
  z: number;
}

export function MyCanvas(props: ICanvasProps) {
  const { camera } = useThree();

  function moveCamera(pos: IPosition) {
    camera.rotation.x = pos.x;
    camera.rotation.y = pos.y;
    camera.rotation.z = pos.z;
  }

  function subscribeController() {
    if (ws.ws) {
      ws.ws.addEventListener("message", (response: any) => {
        const data = JSON.parse(response.data);

        if (data?.type === "position") {
          moveCamera({
            x: data?.pos?.x / 100,
            y: data?.pos?.y / 60,
            z: 0,
          });
        }
      });
    }
  }

  useEffect(() => {
    camera.position.y = 18;
    subscribeController();
  }, [props.webSocket]);

  return (
    <Physics>
      <color attach="background" args={['#bbdefb']} />
      <ambientLight intensity={0.1} />
      <pointLight position={[1, 40, 10]} />
      <Plane />
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
  );
}
