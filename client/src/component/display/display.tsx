import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as ws from "../../hook/ws.hook";
import styles from "./display.module.css";
import { MyCanvas } from "./mycanvas/mycanvas";
import * as handpose from "@tensorflow-models/handpose";
// @ts-ignore
import * as fp from "fingerpose";
import { drawHand } from "../../hook/tracking";

export function Display() {
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [controllerConectionState, setControllerConectionState] =
    useState<boolean>(false);
  const ballRef = useRef<HTMLDivElement | null>(null);
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [handPose, setHandPose] = useState<number[]>([ 0, 0, 0 ])

  function connect(): WebSocket {
    return ws.connect();
  }

  function subscribe(socket: WebSocket) {
    socket.addEventListener("open", () => {
      ws.sendMessage({ type: "connect", deviceType: "display" });
      ws.create();

      socket.addEventListener("message", (response) => {
        const data = JSON.parse(response.data);

        switch (data?.type) {
          case "successCreated":
            setRoomCode(data?.roomCode);
            break;

          case "successJoin":
            setControllerConectionState(true);
            break;

          case "position":
            if (ballRef.current) {
              const { x, y, z } = data?.pos;
              ballRef.current.style.transform = `translate(${x * 4}px, ${
                y * 4
              }px)`;
            }
            break;

          default:
            break;
        }
      });
    });
  }

  // Webcam

  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  async function runHandpose() {
    const net = await handpose.load();
    setInterval(() => {
      detect(net);
    }, 20);
  }

  async function detect(net: any) {
    if (
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.readyState === 4 &&
      canvasRef.current
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const hands = await net.estimateHands(video);

      hands[0]?.annotations?.palmBase[0] && setHandPose(hands[0]?.annotations?.palmBase[0])
      hands.forEach(async (hand: any) => {
        const GE = new fp.GestureEstimator([]);
        const gesture = await GE.estimate(hand.landmarks, 7.5);

        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d");
          drawHand(hands, ctx);
        }
      });
    }
  }

  useEffect(() => {
    const socket = connect();
    setWebSocket(socket);
    subscribe(socket);
    runHandpose()
  }, []);

  return (
    <div className={styles.display}>
      <div className={styles.title}>
        <h1>Display</h1>
      </div>

      <div className={styles.interface}>
        <div className={styles.webcam}>
          <div className={styles.myCam}>
            <Webcam ref={webcamRef} />
          </div>
          <div className={styles.trackingCam}>
            <canvas ref={canvasRef} />
          </div>
        </div>
        <div className={styles.info}>
          <div className={styles.roomCode}>
            <p>
              Room code:&nbsp;<strong>{roomCode}</strong>
            </p>
            <p>
              Connection state:&nbsp;{controllerConectionState}
              <strong>{controllerConectionState.toString()}</strong>
            </p>
          </div>
        </div>
      </div>

      <div className={styles.map}>
        {/* <div className={styles.ball} ref={ballRef}></div> */}
        <MyCanvas webSocket={webSocket} handPos={handPose} />
      </div>
    </div>
  );
}
