//@ts-ignore
import { GestureDescription, Finger, FingerCurl, FingerDirection } from "fingerpose";

export enum fingerPoseName {
    fist = "fist"
}

// fist

const fist = new GestureDescription('fist');
fist.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.7);
fist.addCurl(Finger.Thumb, FingerCurl.FullCurl, 0.7);

for (let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    fist.addCurl(finger, FingerCurl.FullCurl, 1.0);
}

export default { fist }