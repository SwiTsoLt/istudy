import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { ISocketMessage } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private readonly uri: string = '';
  private socket: io.Socket;

  constructor() {
    this.socket = io.connect(this.uri, {
      reconnectionAttempts: 0, // Infinity
    });
    this.uri = this.getUri();
  }

  private getUri(): string {
    const origin = window.location.href
      .split('//')[1]
      .split(':')[0]
      .split('/')[0];
    return window.location.href.includes('https')
      ? `wss://${origin}`
      : `ws://${origin}:3000`;
  }

  public listen(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data);
      });
    });
  }

  public listenMessage(): Observable<ISocketMessage> {
    return new Observable((subscriber) => {
      this.socket.on('message', (message: ISocketMessage) => {
        subscriber.next(message);
      });
    });
  }

  public emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }

  public disconnect() {
    this.socket.disconnect()
  }

  public getSocketId(): string {
    return this.socket.id
  }
}
