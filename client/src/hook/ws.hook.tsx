import React from "react";

type MessageType = "position" | "join" | "create" | "connect";

interface IMessage {
  type: MessageType;
  [key: string]: any;
}

export let ws: WebSocket | null = null;
export let roomConnectState: boolean = false;
export let createState: boolean = false;

export function connect(): WebSocket {
  if (!ws) {
    const origin = window.location.href.split("//")[1].split(":")[0].split("/")[0];
    const url = window.location.href.includes("https")
      ? `wss://${origin}`
      : `ws://${origin}:3000`;
    const new_ws = new WebSocket(url);
    ws = new_ws;
    return new_ws;
  }
  return ws;
}

export function sendMessage(message: IMessage) {
  if (ws && ws.readyState === 1) {
    ws.send(JSON.stringify(message));
  }
}

export function join(code: string) {
  sendMessage({ type: "join", code });
}

export function create() {
  if (!createState) {
    createState = true;
    sendMessage({ type: "create" });
  }
}

export function setRoomConnectState(state: boolean) {
  roomConnectState = state
}
