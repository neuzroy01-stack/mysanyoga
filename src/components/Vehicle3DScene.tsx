import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

type Variant = "scorpio" | "thar" | "sedan";

function pickVariant(name?: string): Variant {
  const n = (name || "").toLowerCase();
  if (n.includes("thar")) return "thar";
  if (n.includes("mercedes") || n.includes("sedan") || n.includes("luxury"))
    return "sedan";
  return "scorpio";
}

function EnvironmentRoad() {
  const roadGroup = useRef<THREE.Group>(null);
  const elementsGroup = useRef<THREE.Group>(null);
  
  const dashes = useMemo(() => Array.from({ length: 40 }), []);
  const scenicProps = useMemo(() => Array.from({ length: 12 }), []);

  useFrame((_, delta) => {
    const speed = 16; 
    if (roadGroup.current) {
      roadGroup.current.position.z += delta * speed;
      if (roadGroup.current.position.z > 3) roadGroup.current.position.z = 0;
    }
    if (elementsGroup.current) {
      elementsGroup.current.position.z += delta * speed;
      if (elementsGroup.current.position.z > 20) elementsGroup.current.position.z = 0;
    }
  });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[14, 120]} />
        <meshStandardMaterial color="#111115" roughness={0.65} metalness={0.2} />
      </mesh>
      <mesh position={[-5.5, -0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.6, 120]} />
        <meshStandardMaterial color="#333a42" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[5.5, -0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.6, 120]} />
        <meshStandardMaterial color="#333a42" metalness={0.8} roughness={0.2} />
      </mesh>
      <group ref={roadGroup}>
        {dashes.map((_, i) => (
          <mesh key={`dash-${i}`} position={[0, -0.49, -60 + i * 3]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.16, 1.5]} />
            <meshBasicMaterial color="#f0a924" />
          </mesh>
        ))}
      </group>
      <group ref={elementsGroup}>
        {scenicProps.map((_, i) => {
          const zPos = -100 + i * 20;
          return (
            <group key={`scenic-${i}`}>
              <mesh position={[-5.3, 2, zPos]} castShadow>
                <cylinderGeometry args={[0.04, 0.07, 5, 8]} />
                <meshStandardMaterial color="#222" metalness={0.7} roughness={0.4} />
              </mesh>
              <mesh position={[-4.7, 4.5, zPos]} rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[1, 0.08, 0.1]} />
                <meshStandardMaterial color="#222" />
              </mesh>
              <mesh position={[-4.2, 4.3, zPos]}>
                <boxGeometry args={[0.3, 0.1, 0.2]} />
                <meshStandardMaterial color="#fff" emissive="#ffddaa" emissiveIntensity={4} />
              </mesh>
              <pointLight position={[-4.2, 4.0, zPos]} intensity={1.5} distance={12} color="#ffeaad" />
            </group>
          );
        })}
      </group>
    </group>
  );
}

function Wheel({ position, radius = 0.36 }: { position: [number, number, number]; radius?: number }) {
  const wheelRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (wheelRef.current) wheelRef.current.rotation.z -= delta * 32;
  });
  return (
    <group position={position}>
      <mesh ref={wheelRef} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[radius, radius, 0.32, 32]} />
        <meshStandardMaterial color="#070709" roughness={0.8} />
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[radius * 0.75, radius * 0.75, 0.3, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.08} />
        </mesh>
      </mesh>
    </group>
  );
}

function HeadlightWithTarget({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.SpotLight>(null);
  const targetRef = useRef<THREE.Object3D>(null);

  useFrame(() => {
    if (lightRef.current && targetRef.current) {
      lightRef.current.target = targetRef.current;
    }
  });

  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.04, 0.12, 0.24]} />
        <meshStandardMaterial color="#ffffff" emissive="#e0f2fe" emissiveIntensity={6.0} />
      </mesh>
      <spotLight ref={lightRef} position={[0.1, 0, 0]} angle={0.4} penumbra={0.4} intensity={4} distance={24} color="#ecf5ff" castShadow />
      <object3D ref={targetRef} position={[10, 0, 0]} />
    </group>
  );
}

function Vehicle({ variant }: { variant: Variant }) {
  const bodyGroup = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!bodyGroup.current) return;
    const t = state.clock.getElapsedTime();
    bodyGroup.current.position.y = Math.sin(t * 14) * 0.008;
    bodyGroup.current.position.x = Math.sin(t * 1.2) * 0.25;
    bodyGroup.current.rotation.z = Math.cos(t * 1.2) * 0.015;
    bodyGroup.current.rotation.y = -Math.PI / 2 + Math.sin(t * 0.8) * 0.02;
  });

  const spec = useMemo(() => {
    switch (variant) {
      case "thar":
        return {
          length: 2.6, bodyH: 0.9, width: 1.45, cabinLen: 1.6, cabinH: 0.75, cabinY: 0.8,
          bodyColor: "#a31d1d", cabinColor: "#18181b", wheelBase: 1.0, wheelTrack: 0.78, wheelR: 0.44, clearcoat: 0.3
        };
      case "sedan":
        return {
          length: 3.6, bodyH: 0.52, width: 1.4, cabinLen: 1.9, cabinH: 0.48, cabinY: 0.5,
          bodyColor: "#090d16", cabinColor: "#11141d", wheelBase: 1.4, wheelTrack: 0.75, wheelR: 0.34, clearcoat: 1.0
        };
      default:
        return {
          length: 3.2, bodyH: 0.85, width: 1.45, cabinLen: 2.1, cabinH: 0.72, cabinY: 0.76,
          bodyColor: "#ffffff", cabinColor: "#12131a", wheelBase: 1.25, wheelTrack: 0.78, wheelR: 0.38, clearcoat: 0.8
        };
    }
  }, [variant]);

  const halfLen = spec.length / 2;

  return (
    <group ref={bodyGroup} position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
      <RoundedBox args={[spec.length * 0.98, spec.bodyH * 0.4, spec.width * 0.98]} radius={0.06} position={[0, -0.1, 0]} castShadow>
        <meshStandardMaterial color="#0e1017" metalness={0.6} roughness={0.5} />
      </RoundedBox>
      <RoundedBox args={[spec.length, spec.bodyH, spec.width]} radius={0.14} position={[0, spec.bodyH / 2 - 0.02, 0]} castShadow>
        <meshPhysicalMaterial color={spec.bodyColor} metalness={0.9} roughness={0.15} envMapIntensity={2.0} clearcoat={spec.clearcoat} clearcoatRoughness={0.1} />
      </RoundedBox>
      <RoundedBox args={[spec.cabinLen, spec.cabinH, spec.width * 0.9]} radius={0.12} position={[-0.1, spec.cabinY + spec.cabinH / 2 - 0.04, 0]} castShadow>
        <meshStandardMaterial color={spec.cabinColor} metalness={0.8} roughness={0.2} envMapIntensity={1.5} />
      </RoundedBox>
      <mesh position={[spec.cabinLen / 2 - 0.08, spec.cabinY + spec.cabinH / 2, 0]} rotation={[0, 0, -0.42]}>
        <boxGeometry args={[0.02, spec.cabinH * 0.9, spec.width * 0.84]} />
        <meshPhysicalMaterial color="#0f1926" roughness={0.02} transmission={0.9} transparent opacity={0.9} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={`win-${side}`} position={[-0.1, spec.cabinY + spec.cabinH / 2, (side * spec.width) / 2 - side * 0.01]}>
          <boxGeometry args={[spec.cabinLen * 0.88, spec.cabinH * 0.72, 0.02]} />
          <meshPhysicalMaterial color="#090f16" roughness={0.01} transmission={0.85} transparent opacity={0.95} />
        </mesh>
      ))}
      {[-spec.width * 0.34, spec.width * 0.34].map((zPos, idx) => (
        <HeadlightWithTarget key={`hl-${idx}`} position={[halfLen + 0.01, spec.bodyH * 0.58, zPos]} />
      ))}
      {[-spec.width * 0.34, spec.width * 0.34].map((zPos, idx) => (
        <mesh key={`tail-${idx}`} position={[-halfLen - 0.01, spec.bodyH * 0.6, zPos]}>
          <boxGeometry args={[0.03, 0.1, 0.22]} />
          <meshStandardMaterial color="#991b1b" emissive="#ef4444" emissiveIntensity={4.0} />
        </mesh>
      ))}
      {[-0.3, 0.3].map((zOff, idx) => (
        <mesh key={`exhaust-${idx}`} position={[-halfLen - 0.02, 0.05, zOff]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.15, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.05} />
        </mesh>
      ))}
      <Wheel position={[spec.wheelBase, -0.42 + (spec.wheelR - 0.36), spec.wheelTrack]} radius={spec.wheelR} />
      <Wheel position={[spec.wheelBase, -0.42 + (spec.wheelR - 0.36), -spec.wheelTrack]} radius={spec.wheelR} />
      <Wheel position={[-spec.wheelBase, -0.42 + (spec.wheelR - 0.36), spec.wheelTrack]} radius={spec.wheelR} />
      <Wheel position={[-spec.wheelBase, -0.42 + (spec.wheelR - 0.36), -spec.wheelTrack]} radius={spec.wheelR} />
    </group>
  );
}

function ActiveCinematicCamera() {
  useFrame((state) => {
    const time = state.clock.getElapsedTime() * 0.25;
    const baseRadius = 6.2;
    const dynamicAngle = Math.PI * 0.78 + Math.sin(time) * 0.22;
    state.camera.position.x = Math.sin(dynamicAngle) * baseRadius;
    state.camera.position.z = Math.cos(dynamicAngle) * baseRadius;
    state.camera.position.y = 1.4 + Math.cos(time * 2) * 0.25;
    state.camera.lookAt(0, 0.4, 0);
  });
  return null;
}

export default function Vehicle3DScene({ vehicleName }: { vehicleName?: string }) {
  const variant = pickVariant(vehicleName);
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [5, 2, 5], fov: 38 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#060609"]} />
      <fog attach="fog" args={["#060609", 10, 32]} />
      <ambientLight intensity={0.4} />
      <hemisphereLight args={["#7dd3fc", "#111827", 0.6]} />
      <directionalLight position={[12, 20, 8]} intensity={2.5} castShadow />
      <EnvironmentRoad />
      <Vehicle variant={variant} />
      <ContactShadows position={[0, -0.49, 0]} opacity={0.85} scale={12} blur={2.2} far={2} />
      <Environment preset="night" />
      <ActiveCinematicCamera />
    </Canvas>
  );
}