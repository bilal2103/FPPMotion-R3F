import { useEffect, useState, useRef } from "react"
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from "three";
import FBXLoader from "../loaders/fbxLoader";

function Plane(){
    return (
        <mesh rotation={[-Math.PI/2, 0, 0]}>
            <boxGeometry args={[2, 4, 0.01]} />
            <meshStandardMaterial color="gray" />
        </mesh>
    )
}

export default function Movement() {
    const velocity = 0.1;
    const lerpFactor = 0.1; // How fast to lerp to the new position (0.1 = 10% each frame)
    const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
    const fbxModel = useLoader(FBXLoader, "/models/Walking.fbx");
    const mixerRef = useRef<THREE.AnimationMixer | null>(null);
    const actionRef = useRef<THREE.AnimationAction | null>(null);
    const clockRef = useRef(new THREE.Clock());
    
    useEffect(() => {
        fbxModel.scale.set(0.01, 0.01, 0.01);
        
        // Set up animation mixer and actions
        if (fbxModel.animations && fbxModel.animations.length > 0) {
            mixerRef.current = new THREE.AnimationMixer(fbxModel);
            
            // Clone the animation to modify it
            const originalClip = fbxModel.animations[0];
            const clonedClip = originalClip.clone();
            
            // Debug: Log all track names to see what we're working with
            console.log("Animation tracks:", originalClip.tracks.map(track => track.name));
            
            // Remove only root motion position tracks (usually the main body/hip movement)
            clonedClip.tracks = clonedClip.tracks.filter(track => {
                // Remove position tracks that cause forward movement (typically root/hip bones)
                const isRootPosition = track.name.includes('.position') && 
                                     (track.name.includes('mixamorig:Hips') || 
                                      track.name.includes('Root') || 
                                      track.name.includes('Hip') ||
                                      track.name.toLowerCase().includes('root'));
                if (isRootPosition) {
                    console.log("Removing root motion track:", track.name);
                }
                return !isRootPosition;
            });
            
            actionRef.current = mixerRef.current.clipAction(clonedClip);
            actionRef.current.setLoop(THREE.LoopRepeat, Infinity);
        }
    }, [fbxModel]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            setKeysPressed(prev => new Set(prev).add(event.key));
        }
        const handleKeyUp = (event: KeyboardEvent) => {
            setKeysPressed(prev => {
                const newSet = new Set(prev);
                newSet.delete(event.key);
                return newSet;
            });
        }
        window.addEventListener("keydown", handleKeyDown)
        window.addEventListener("keyup", handleKeyUp)
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("keyup", handleKeyUp)
        }
    }, [])

    // Movement with lerping and animation
    const { camera } = useThree();
    useFrame(() => {
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);  // Get the direction the camera is facing
        const up = new THREE.Vector3(0, 1, 0);

        const right = new THREE.Vector3();
        right.crossVectors(forward, up).normalize();  // Proper right vector calculation
        let vectorToAdd = new THREE.Vector3();
        let isMoving = false;
        
        if (keysPressed.has("w")) {
            vectorToAdd = forward.clone().multiplyScalar(velocity); // Forward
            isMoving = true;
        }
        if (keysPressed.has("s")) {
            vectorToAdd = forward.clone().multiplyScalar(-velocity); // Backward
            isMoving = true;
        }
        if (keysPressed.has("d")) {
            vectorToAdd = right.clone().multiplyScalar(velocity); // Right
            isMoving = true;
        }
        if (keysPressed.has("a")) {
            vectorToAdd = right.clone().multiplyScalar(-velocity); // Left
            isMoving = true;
        }
        
        // Move both camera and model together
        if (isMoving) {
            camera.position.add(vectorToAdd);
            fbxModel.position.add(vectorToAdd);
        }
        
        // Handle animation
        if (mixerRef.current && actionRef.current) {
            if (isMoving) {
                // Play walking animation when moving
                if (!actionRef.current.isRunning()) {
                    actionRef.current.play();
                }
            } else {
                // Stop animation when not moving
                if (actionRef.current.isRunning()) {
                    actionRef.current.stop();
                }
            }
            
            // Update the animation mixer
            const delta = clockRef.current.getDelta();
            mixerRef.current.update(delta);
        }
        
    });

    return (
        <>
        <primitive object={fbxModel} position={[0, -2, 0]} rotation={[0, Math.PI/2, 0]} />
        <Plane />
        </>
    )
}