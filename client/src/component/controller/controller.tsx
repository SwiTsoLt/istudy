import React, { useEffect, useRef, useState } from "react";
import * as ws from "../../hook/ws.hook";
import styles from "./controller.module.css";

interface IPos {
  x: number;
  y: number;
  z: number;
}

export function Controller() {
  const ballRef = useRef<HTMLDivElement>(null);
  const [isPress, setIsPress] = useState<boolean>(false)
  const [pos, setPos] = useState<IPos>({ x: 0, y: 0, z: 0 });
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [controllerConectionState, setControllerConectionState] =
  useState<boolean>(false);

  function subscribeToMove() {
    let isSend: boolean = true
    
    window.addEventListener("deviceorientation", (data) => {
      const x = Math.round(data.gamma || 0);
      const y = Math.round(data.beta || 0);
      const z = Math.round(data.alpha || 0);

      setPos({ x, y, z });

      if (ballRef.current) {
        ballRef.current.style.transform = `translate(${x * 4}px, ${y * 4}px)`;
      }

      if (ws.roomConnectState) {
        if (isSend && isPress) {
          alert('send: ', x, '/', y, '/', z)
          ws.sendMessage({ type: "position", pos: { x, y, z } }); 
          isSend = false       
        } else {
          isSend = true
        }
      } else {
        console.log("connect state:", ws?.roomConnectState)
      }
    });
    // let testpos = {x: 0, y: 0, z:0}

    // setInterval(() => {
    //   testpos = { x: testpos.x + 1, y: testpos.y + 1, z: testpos.z + 1 }
    //   ws.sendMessage({ type: "position", pos: testpos });
    // }, 1000)
  }

  function join() {
    if (roomCode) {
      ws.join(roomCode);
    } else {
      console.log("room code can't be empty");
    }
  }

  function subscribe() {
    if (ws && ws.ws) {
      ws.ws.addEventListener("open", () => {
        ws.sendMessage({ type: "connect", deviceType: "controller" });

        if (ws && ws.ws) {
          ws.ws.addEventListener("message", (response) => {
            const data = JSON.parse(response.data);

            switch (data?.type) {
              case "successJoin":
                ws.setRoomConnectState(true)
                setControllerConectionState(true)
                subscribeToMove();
                break;

              default:
                break;
            }
          });
        }
      });
    }
  }

  function connect() {
    ws.connect();
  }

  useEffect(() => {
    connect();
    subscribe();
  }, [ws]);

  return (
    <div className={styles.controller} onTouchStart={() => setIsPress(true)} onTouchEnd={() => setIsPress(false)}>
      <div className={styles.title}>
        <h1>Controller</h1>
      </div>
      <div className={styles.info}>
        <p>
          x: <strong>{pos.x}</strong>
        </p>
        <p>
          y: <strong>{pos.y}</strong>
        </p>
        <p>
          z: <strong>{pos.z}</strong>
        </p>
        <p>
          coonection state: <strong>{controllerConectionState.toString()}</strong>
        </p>
      </div>
      <div className={styles.map}>
        <div className={styles.ball} ref={ballRef}></div>
      </div>
      <div className={styles.form}>
        <input
          type="string"
          placeholder="room code"
          value={roomCode || ""}
          onChange={(e) => setRoomCode(e.target.value)}
        />
        <button onClick={() => join()}>connect</button>
      </div>
    </div>
  );
}
