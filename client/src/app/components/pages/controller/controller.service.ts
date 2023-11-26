import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface IPosition {
    beta: number,
    gamma: number,
    alpha: number
}

@Injectable({
    providedIn: "root",
})
export class ControllerService {

    private sensitivity: number = 8;

    public subscribeToDeviceOrientation(): Observable<IPosition> {
        return new Observable(observer => {
            window.addEventListener("deviceorientation", event => {
                if (event.beta !== null && event.gamma !== null && event.alpha !== null) {
                    const { beta, gamma, alpha } = this.normalizePosition(event.beta, event.gamma, event.alpha);
                    observer.next({ beta, gamma, alpha });
                }
            });
        });
    }

    private normalizePosition(beta: number, gamma: number, alpha: number): IPosition {
        const radius = 50;
        const maxRotation = 180;
        const defaultBetaRotation = 40;
        const defaultBettaMaxRotationCorrection = 1 + defaultBetaRotation / maxRotation;
    
        let [normalizeBeta, normalizeGamma] = [
            (beta - defaultBetaRotation) * this.sensitivity / maxRotation * radius * defaultBettaMaxRotationCorrection,
            gamma * this.sensitivity / maxRotation * radius
        ];
    
        [normalizeBeta, normalizeGamma] = [
            normalizeBeta >= 0
                ? normalizeBeta > radius ? radius : normalizeBeta
                : normalizeBeta < -radius ? -radius : normalizeBeta,
            normalizeGamma > 0
                ? normalizeGamma > radius ? radius : normalizeGamma
                : normalizeGamma < -radius ? -radius : normalizeGamma
        ];
    
        return {
            beta: normalizeBeta,
            gamma: normalizeGamma,
            alpha
        };
    }
}