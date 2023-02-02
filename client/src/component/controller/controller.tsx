import React, { useEffect, useRef, useState } from "react";
import * as ws from "../../hook/ws.hook";
import "./controller.scss";

interface IPos {
  x: number;
  y: number;
  z: number;
}

export function Controller() {
  const ballRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<IPos>({ x: 0, y: 0, z: 0 });
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [controllerConectionState, setControllerConectionState] =
  useState<boolean>(false);

  function subscribeToMove() {
    window.addEventListener("deviceorientation", (data) => {
      const x = Math.round(data.gamma || 0);
      const y = Math.round(data.beta || 0);
      const z = Math.round(data.alpha || 0);

      setPos({ x, y, z });

      if (ballRef.current) {
        ballRef.current.style.transform = `translate(${x * 4}px, ${y * 4}px)`;
      }

      if (ws.roomConnectState) {
        ws.sendMessage({ type: "position", pos: { x, y, z } });
      }
    });
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
            console.log(data);

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
  }, []);

  return (
    <div className="controller">
      <div className="title">
        <h1>Controller</h1>
      </div>
      <div className="info">
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
      <div className="map">
        <div className="ball" ref={ballRef}></div>
      </div>
      <div className="form">
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
