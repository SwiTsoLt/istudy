import React, { useEffect, useRef, useState } from "react";
import * as ws from "../../hook/ws.hook";
import styles from "./display.module.scss"

export function Display() {
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [controllerConectionState, setControllerConectionState] =
    useState<boolean>(false);
  const ballRef = useRef<HTMLDivElement | null>(null);

  function connect(): WebSocket {
    return ws.connect();
  }

  function subscribe(socket: WebSocket) {
    socket.addEventListener("open", () => {
      ws.sendMessage({ type: "connect", deviceType: "display" });
      ws.create();

      socket.addEventListener("message", (response) => {
        const data = JSON.parse(response.data);
        console.log(data);

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

  useEffect(() => {
    const socket = connect();
    subscribe(socket);
  }, []);

  return (
    <div className={styles.display}>
      <div className={styles.title}>
        <h1>Display</h1>
      </div>

      <div className={styles.info}>
        <div className={styles.roomCode}>
          <p>
            Room code: <strong>{roomCode}</strong>
          </p>
          <p>
            Connection state:{controllerConectionState}
            <strong>{controllerConectionState.toString()}</strong>
          </p>
        </div>
      </div>

      <div className={styles.map}>
        <div className={styles.ball} ref={ballRef}></div>
      </div>
    </div>
  );
}
