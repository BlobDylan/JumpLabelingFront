import { Line, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import type { GeoPoint } from "../types";
import { useData } from "../hooks/useData";

interface Props {
  data: GeoPoint[];
}

const GeoScene = ({ data }: Props) => {
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

  // Handler to toggle label
  const handlePointClick = (idx: number) => {
    setLocalData((prev) => {
      const updated = prev.map((p, i) =>
        i === idx ? { ...p, label: (p.label === 0 ? 1 : 0) as 0 | 1 } : p
      );
      // Sync to global context, stripping normalization fields
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

  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {localData.map((point, i) => (
        <mesh
          key={i}
          position={[point.normLon, point.normTime, point.normLat]}
          onClick={() => handlePointClick(i)}
        >
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            emissive={point.label === 0 ? "green" : "red"}
            color={point.label === 0 ? "green" : "red"}
          />
        </mesh>
      ))}
      {points.length > 1 && (
        <Line points={points} color="white" lineWidth={1} />
      )}
      <OrbitControls />
      <axesHelper args={[5]} />
    </Canvas>
  );
};

export default GeoScene;
