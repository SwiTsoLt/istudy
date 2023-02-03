import React, { useState, useEffect } from "react"
import { useLoader } from "@react-three/fiber"
import { TextureLoader } from "three"

import { useBox } from "@react-three/cannon"

interface IHandProps {
    handPos: number[]
} 

export function Hand(props: IHandProps) {
    const [handTexture] = useLoader(TextureLoader, [
        "../media/hand.jpg"
    ])

    const [handPos, setHandPos] = useState([0, 0, 0])

    useEffect(() => {
        setHandPos(props.handPos)
    }, [props.handPos])

    return (
        <mesh position={[4 - handPos[0] / 60, 4 - handPos[1] / 60, 1]}>
            <sphereGeometry />
            <meshStandardMaterial map={handTexture}/>
        </mesh>
    )
}