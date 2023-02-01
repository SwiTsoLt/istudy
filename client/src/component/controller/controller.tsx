import React, { useEffect, useRef, useState } from "react";
import "./controller.scss";

export function Controller() {
  interface IPos {
    x: number;
    y: number;
    z: number;
  }

  const ballRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<IPos>({ x: 0, y: 0, z: 0 });

  function subscribeToMove() {
    window.addEventListener("deviceorientation", (data) => {
        setPos({
          x: Math.round(data.gamma || 0),
          y: Math.round(data.beta || 0),
          z: Math.round(data.alpha || 0),
        });
    
        if (ballRef.current) {
          ballRef.current.style.transform = `translate(${(data.gamma || 0) * 4}px, ${(data.beta || 0) * 4}px)`
        }
      });
  }

  useEffect(() => {
    subscribeToMove()
  }, [])

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
      </div>
      <div className="map">
        <div className="ball" ref={ballRef}></div>
      </div>
    </div>
  );
}
