import { Injectable } from "@angular/core";
import { EMPTY, Observable, catchError, forkJoin, take } from "rxjs";
import * as io from "socket.io-client";
import { ISocketMessage } from "./interfaces";
import { WSReducerState } from "./store/ws-store/ws.reducer";
import { Action, Store } from "@ngrx/store";
import * as WSActions from "./store/ws-store/ws.actions";
import { ToastState } from "./store/toast-store/toast.reducer";
import { createToast } from "./store/toast-store/toast.actions";
import { wsListenerEventEnum } from "./store/ws-store/ws.interface";
import { IListenerData } from "./store/webrtc-store/webrtc.interface";

@Injectable({
    providedIn: "root",
})
export class WebSocketService {
    private readonly uri: string = "";
    private socket: io.Socket;

    private reconnectCounter: number = 0;

    constructor(
        private wsStore$: Store<WSReducerState>,
        private toastStore$: Store<ToastState>,
    ) {
        this.socket = io.connect(this.uri, {
            reconnectionAttempts: 0, // Infinity
        });
        this.uri = this.getUri();
    }

    private getUri(): string {
        const origin = window.location.href
            .split("//")[1]
            .split(":")[0]
            .split("/")[0];
        return window.location.href.includes("https")
            ? `wss://${origin}`
            : `ws://${origin}:3000`;
    }

    public listen(eventName: string): Observable<IListenerData> {
        return new Observable((subscriber) => {
            this.socket.on(eventName, (data: IListenerData) => {
                subscriber.next(data);
            });
        });
    }

    public listenMessage(): Observable<ISocketMessage> {
        return new Observable((subscriber) => {
            this.socket.on("message", (message: ISocketMessage) => {
                subscriber.next(message);
            });
        });
    }

    public emit(eventName: string, data: unknown): void {
        this.socket.emit(eventName, data);
    }

    public disconnect() {
        this.socket.disconnect();
    }

    public getSocketId(): string {
        return this.socket.id;
    }

    public joinRoom(
        roomCode: string,
        isConnected$: Observable<boolean>,
        showJoinerPopupState$: Observable<boolean>,
        isReady$: Observable<boolean>
    ) {
        this.wsStore$.dispatch(WSActions.joinRoom({ roomCode }));

        setTimeout(() => {
            forkJoin(
                isConnected$.pipe(take(1)),
                showJoinerPopupState$.pipe(take(1)),
                isReady$.pipe(take(1))
            )
                .subscribe(([isConnected, showJoinerPopupState, isReady]) => {
                    if (isConnected) return;
                    if (isReady) return;
                    if (!showJoinerPopupState) return;
                    if (this.reconnectCounter >= 3) {
                        this.toastStore$.dispatch(createToast({ toast: { type: "error", text: "Переподключение не удалось" } }));
                        this.wsStore$.dispatch(WSActions.joinRoomError());
                        return;
                    }

                    this.toastStore$.dispatch(createToast({ toast: { type: "error", text: "Ошибка подключения" } }));

                    setTimeout(() => {
                        this.toastStore$.dispatch(createToast({ toast: { type: "notify", text: "Переподключение" } }));
                        this.joinRoom(roomCode, isConnected$, showJoinerPopupState$, isReady$);
                    }, 1000);

                    this.reconnectCounter += 1;
                });
        }, 5000);
    }

    private subscribeHandler(
        listenerName: string,
        successFunction: ({ roomCode } : { roomCode: string }) => Action,
        errorFunction: () => Action,
        withRoomCode: boolean
    ): void {
        this.listen(listenerName)
            .pipe(
                catchError(() => {
                    this.wsStore$.dispatch(errorFunction());
                    return EMPTY;
                })
            ).subscribe((data: unknown) => {
                if (withRoomCode) {
                    if (!data) return this.wsStore$.dispatch(errorFunction());
                    if (!data["roomCode" as keyof typeof data]) return this.wsStore$.dispatch(errorFunction());

                    return this.wsStore$.dispatch(successFunction({ roomCode: data["roomCode" as keyof typeof data] }));
                }
                return this.wsStore$.dispatch(successFunction({ roomCode: "" }));
            });
    }

    public subscribeAll(): void {
        this.subscribeHandler(wsListenerEventEnum.createRoomSuccess, WSActions.createRoomSuccess, WSActions.createRoomError, true);
        this.subscribeHandler(wsListenerEventEnum.createRoomError, WSActions.createRoomError, WSActions.createRoomError, false);
        this.subscribeHandler(wsListenerEventEnum.removeRoomSuccess, WSActions.removeRoomSuccess, WSActions.removeRoomError, false);
        this.subscribeHandler(wsListenerEventEnum.removeRoomError, WSActions.removeRoomError, WSActions.removeRoomError, false);
        this.subscribeHandler(wsListenerEventEnum.joinRoomSuccess, WSActions.joinRoomSuccess, WSActions.joinRoomError, true);
        this.subscribeHandler(wsListenerEventEnum.joinRoomError, WSActions.joinRoomError, WSActions.joinRoomError, false);
        this.subscribeHandler(wsListenerEventEnum.leaveRoomSuccess, WSActions.leaveRoomSuccess, WSActions.leaveRoomError, false);
        this.subscribeHandler(wsListenerEventEnum.leaveRoomError, WSActions.leaveRoomError, WSActions.leaveRoomError, false);
    }
}
