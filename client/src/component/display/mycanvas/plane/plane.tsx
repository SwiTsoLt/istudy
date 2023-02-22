import React, { useEffect } from "react";
import { usePlane } from "@react-three/cannon";
// import { TextureLoader } from "three/src/loaders/TextureLoader";
import { useLoader, useThree } from "@react-three/fiber";
import { Mesh, TextureLoader } from "three";
import * as ws from "../../../../hook/ws.hook";

interface IPosition {
  x: number;
  y: number;
  z: number;
}

interface IPlaneProps {
  webSocket: WebSocket | null;
}

export function Plane(props: IPlaneProps) {
  const planeTexture = useLoader(TextureLoader, "../media/plane.png");
  const [planeRef] = usePlane<Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [1, -2, -1],
  }));

  const { camera } = useThree();

  function moveCamera(pos: IPosition) {
    camera.rotation.x = pos.x;
    camera.rotation.y = pos.y;
    camera.rotation.z = pos.z;
  }

  function subscribeController() {
    if (ws.ws) {
      ws.ws.addEventListener("message", (response) => {
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
    camera.position.y = 18
    subscribeController();
  }, [props.webSocket]);

  return (
    <mesh ref={planeRef} scale={[300, 100, 1]}>
      <planeGeometry args={[10, 10, 1]} />
      <meshStandardMaterial map={planeTexture} />
    </mesh>
  );
}
