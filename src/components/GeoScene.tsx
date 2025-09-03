import { Environment, Line, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo, useState, useEffect, useRef } from "react";
import * as THREE from "three";
import type { GeoPoint } from "../types";
import { useData } from "../hooks/useData";
import { Button } from "@mui/material";

interface Props {
  data: GeoPoint[];
}

const GeoScene = ({ data }: Props) => {
  const orbitRef = useRef<any>(null);
  const defaultCameraPosition = [0, 5, 10];

  // Handler to reset camera position
  const handleResetCamera = () => {
    if (orbitRef.current && orbitRef.current.object) {
      orbitRef.current.object.position.set(...defaultCameraPosition);
      orbitRef.current.object.lookAt(0, 0, 0);
      if (orbitRef.current.target) {
        orbitRef.current.target.set(0, 0, 0);
      }
    }
  };
  // Normalize data and store with label state
  const getNormalizedData = (inputData: GeoPoint[]) => {
    if (inputData.length === 0) return [];

    const minLat = Math.min(...inputData.map((p) => p.lat));
    const maxLat = Math.max(...inputData.map((p) => p.lat));
    const minLon = Math.min(...inputData.map((p) => p.lon));
    const maxLon = Math.max(...inputData.map((p) => p.lon));
    const minTime = Math.min(...inputData.map((p) => p.time));
    const maxTime = Math.max(...inputData.map((p) => p.time));

    const normalize = (
      value: number,
      min: number,
      max: number,
      newMin = -5,
      newMax = 5
    ) => {
      if (max - min === 0) return newMin;
      return newMin + ((value - min) * (newMax - newMin)) / (max - min);
    };

    return inputData.map((p) => ({
      ...p,
      normLat: normalize(p.lat, minLat, maxLat),
      normLon: normalize(p.lon, minLon, maxLon),
      normTime: normalize(p.time, minTime, maxTime),
      label: p.label ?? 0,
    }));
  };

  const getMinDistance = (
    points: Array<{ normLat: number; normLon: number; normTime: number }>
  ) => {
    let minDist = Infinity;
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].normLon - points[j].normLon;
        const dy = points[i].normTime - points[j].normTime;
        const dz = points[i].normLat - points[j].normLat;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < minDist) minDist = dist;
      }
    }
    return minDist === Infinity || minDist < 0.04 ? 0.03 : minDist;
  };

  const { updateData } = useData();
  const [localData, setLocalData] = useState(() => getNormalizedData(data));

  // Update localData when data changes
  useEffect(() => {
    setLocalData(getNormalizedData(data));
  }, [data]);

  const points = useMemo(() => {
    return localData.map(
      (p) => new THREE.Vector3(p.normLon, p.normTime, p.normLat)
    );
  }, [localData]);

  const handlePointClick = (idx: number) => {
    setLocalData((prev) => {
      const updated = prev.map((p, i) =>
        i === idx ? { ...p, label: (p.label === 0 ? 1 : 0) as 0 | 1 } : p
      );
      const contextData = updated.map((p) => ({
        lat: p.lat,
        lon: p.lon,
        time: p.time,
        label: p.label,
      }));
      updateData(contextData);
      return updated;
    });
  };

  const sphereRadius = useMemo(() => {
    if (localData.length < 2) return 0.1;
    const minDist = getMinDistance(localData);
    return minDist / 3;
  }, [localData]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Button
        variant="contained"
        sx={{
          position: "absolute",
          zIndex: 2,
          top: 10,
          right: 10,
        }}
        disableRipple
        disableFocusRipple
        onClick={handleResetCamera}
      >
        Reset
      </Button>
      <Canvas
        camera={{ position: [0, 5, 10] as [number, number, number], fov: 75 }}
      >
        <OrbitControls ref={orbitRef} />
        <Environment preset="forest" />
        {localData.map((point, i) => (
          <mesh
            key={i}
            position={[point.normLon, point.normTime, point.normLat]}
            onClick={() => handlePointClick(i)}
          >
            <sphereGeometry args={[sphereRadius, 16, 16]} />
            <meshStandardMaterial
              emissive={point.label === 0 ? "green" : "red"}
              color={point.label === 0 ? "green" : "red"}
            />
          </mesh>
        ))}
        {points.length > 1 && (
          <Line points={points} color="white" lineWidth={1} />
        )}
        <axesHelper args={[8]} />
      </Canvas>
    </div>
  );
};

export default GeoScene;
