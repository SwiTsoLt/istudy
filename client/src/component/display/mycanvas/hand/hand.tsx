import React, { useState, useEffect } from "react"
import { useLoader } from "@react-three/fiber"
import { TextureLoader } from "three"

interface IHandProps {
    handPos: number[],
    isGrab: boolean
} 

export function Hand(props: IHandProps) {
    const [handTexture, grabTexture] = useLoader(TextureLoader, [
        "../media/hand.jpg",
        "../media/grab.jpg"
    ])

    const [handPos, setHandPos] = useState([0, 0, 0])

    useEffect(() => {
        setHandPos(props.handPos)
    }, [props.handPos])

    return (
        <mesh position={[
            (8 - handPos[0] / 40) / 3,
            (6 - handPos[1] / 50) / 3 + 18,
            -1
            ]}>
            <sphereGeometry args={[0.2]} />
            <meshStandardMaterial map={props.isGrab ? grabTexture : handTexture}/>
        </mesh>
    )
}