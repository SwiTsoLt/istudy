import { Injectable } from "@angular/core";
import { Observable, Subscriber } from "rxjs";
import { IMessage } from "./interfaces";


@Injectable({
    providedIn: 'root',
})
export class WebRtcService {

    private pc: RTCPeerConnection | null = null;
    private dataChannel: RTCDataChannel | null = null;

    public init() {
        console.log(window.location.origin.replace('http://', 'stun:').replace('https://', 'stun:').split(':')[0]);

        this.pc = new RTCPeerConnection({
            iceServers: [
                {
                    urls: `${window.location.origin.replace('http://', 'stun:').replace('https://', 'stun:').split(':')[0]}`
                },
                {
                    urls:`${window.location.origin.replace('http://', 'turn:').replace('https://', 'turn:').split(':')[0]}`,
                    username: 'webrtc',
                    credential: 'turnpassword'
                }
            ]
        })
    }

    public sendMessage(socketId: string, text: string): { newMessage?: IMessage, msg?: string } {
        const newMessage: IMessage = { name: socketId, text }

        if (this.dataChannel) {
            this.dataChannel.send(JSON.stringify(newMessage))
            return { newMessage }
        }

        return { msg: 'data channel close' }
    }

    // Subscribers

    public subscribeToIceCandidate(): Observable<RTCIceCandidate | undefined> {
        return new Observable((subscriber: Subscriber<RTCIceCandidate | undefined>) => {
            if (this.pc) {
                this.pc.addEventListener('icecandidate', (event: RTCPeerConnectionIceEvent) => {
                    subscriber.next(event.candidate || undefined)
                })

                this.pc.addEventListener('icecandidateerror', console.log)
            }
        })
    }

    public subscribeToDataChannelOpen(dataChannel?: RTCDataChannel): Observable<Event> {
        if (dataChannel) {
            return new Observable((subscriber: Subscriber<Event>) => {
                dataChannel.addEventListener("open", (event: Event) => {
                    subscriber.next(event)
                })
            })
        }

        return new Observable((subscriber: Subscriber<Event>) => {
            if (this.pc) {
                this.pc.addEventListener("datachannel", (event: RTCDataChannelEvent) => {
                    this.setDataChannel(event.channel)

                    event.channel.addEventListener("open", (message: Event) => {
                        subscriber.next(message)
                    })
                })
            }
        })
    }

    public subscribeToDataChannelClose(dataChannel?: RTCDataChannel): Observable<Event> {
        if (dataChannel) {
            return new Observable((subscriber: Subscriber<Event>) => {
                dataChannel.addEventListener("close", (event: Event) => {
                    subscriber.next(event)
                })
            })
        }

        return new Observable((subscriber: Subscriber<Event>) => {
            if (this.pc) {
                this.pc.addEventListener("datachannel", (event: RTCDataChannelEvent) => {
                    event.channel.addEventListener("close", (message: Event) => {
                        subscriber.next(message)
                    })
                })
            }
        })
    }

    public subscribeToDataChannelMessage(dataChannel?: RTCDataChannel): Observable<string> {
        if (dataChannel) {
            return new Observable((subscriber: Subscriber<string>) => {
                dataChannel.addEventListener("message", (event: MessageEvent<string>) => {
                    subscriber.next(event.data)
                })
            })
        }

        return new Observable((subscriber: Subscriber<string>) => {
            if (this.pc) {
                this.pc.addEventListener("datachannel", (event: RTCDataChannelEvent) => {
                    event.channel.addEventListener("message", (message: MessageEvent<string>) => {
                        subscriber.next(message.data)
                    })
                })
            }
        })
    }

    // Creators

    public createOffer(): Observable<RTCSessionDescriptionInit> {
        return new Observable((subscriber: Subscriber<RTCSessionDescriptionInit>) => {
            if (this.pc) {
                this.pc.createOffer()
                    .then((description: RTCSessionDescriptionInit) => subscriber.next(description))
            }
        })
    }

    public createAnswer(): Observable<RTCSessionDescriptionInit> {
        return new Observable((subscriber: Subscriber<RTCSessionDescriptionInit>) => {
            if (this.pc) {
                this.pc.createAnswer()
                    .then((description: RTCSessionDescriptionInit) => subscriber.next(description))
            }
        })
    }

    // Setters

    public setLocalDescription(description: RTCSessionDescriptionInit) {
        if (this.pc) {
            this.pc.setLocalDescription(description)
        }
    }

    public setRemoteDescription(description: RTCSessionDescriptionInit) {
        if (this.pc) {
            this.pc.setRemoteDescription(description)
        }
    }

    public addIceCandidate(candidate: RTCIceCandidate | undefined) {
        if (this.pc) {
            this.pc.addIceCandidate(candidate)
        }
    }

    public addChannel(channelName: string): RTCDataChannel | null {
        if (this.pc) {
            return this.pc.createDataChannel(channelName)
        }

        return null
    }

    public setDataChannel(dataChannel: RTCDataChannel) {
        this.dataChannel = dataChannel
    }

    // Getters

    public getLocalDescription(): RTCSessionDescription | null {
        if (this.pc) {
            return this.pc.localDescription
        }

        return null
    }

    public getRemoteDescription(): RTCSessionDescription | null {
        if (this.pc) {
            return this.pc.remoteDescription
        }

        return null
    }

    public getDataChannel(): RTCDataChannel | null {
        return this.dataChannel
    }
}