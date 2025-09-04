import { Environment, OrbitControls } from "@react-three/drei";
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

  const handleResetCamera = () => {
    if (orbitRef.current && orbitRef.current.object) {
      orbitRef.current.object.position.set(...defaultCameraPosition);
      orbitRef.current.object.lookAt(0, 0, 0);
      if (orbitRef.current.target) {
        orbitRef.current.target.set(0, 0, 0);
      }
    }
  };
  const getNormalizedData = (inputData: GeoPoint[], sphereRadius: number) => {
    if (inputData.length === 0) return [];

    const minLat = Math.min(...inputData.map((p) => p.lat));
    const maxLat = Math.max(...inputData.map((p) => p.lat));
    const minLon = Math.min(...inputData.map((p) => p.lon));
    const maxLon = Math.max(...inputData.map((p) => p.lon));

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

    const sorted = [...inputData].sort((a, b) => a.time - b.time);
    const minSpacing = 2 * sphereRadius;
    return sorted.map((p, i) => ({
      ...p,
      normLat: normalize(p.lat, minLat, maxLat),
      normLon: normalize(p.lon, minLon, maxLon),
      normTime: i * minSpacing,
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
  // Store labels separately so updating them doesn't affect normalization
  const [labels, setLabels] = useState<GeoPoint["label"][]>(
    data.map((p) => p.label ?? 0)
  );
  // Calculate sphereRadius and normalized data only when data changes
  const [sphereRadius, setSphereRadius] = useState(0.1);
  const [normalizedData, setNormalizedData] = useState<
    ReturnType<typeof getNormalizedData>
  >([]);

  useEffect(() => {
    // Reset labels on new data
    setLabels(data.map((p) => p.label ?? 0));
    // Initial normalization and sphere radius calculation
    const tempData = getNormalizedData(data, 0.1);
    const minDist = getMinDistance(tempData);
    const newRadius = minDist / 3;
    setSphereRadius(newRadius);
    setNormalizedData(getNormalizedData(data, newRadius));
  }, [data]);

  // Merge normalized positions with current labels
  const mergedData = useMemo(() => {
    return normalizedData.map((p, i) => ({ ...p, label: labels[i] ?? 0 }));
  }, [normalizedData, labels]);

  const points = useMemo(() => {
    return mergedData.map(
      (p) => new THREE.Vector3(p.normLon, p.normTime, p.normLat)
    );
  }, [mergedData]);

  const handlePointClick = (idx: number) => {
    setLabels((prev) => {
      const updated = prev.map((label, i) =>
        i === idx ? (label === 0 ? 1 : 0) : label
      );
      // Sync to global context
      const contextData = data.map((p, i) => ({
        lat: p.lat,
        lon: p.lon,
        time: p.time,
        label: updated[i],
      }));
      updateData(contextData);
      return updated;
    });
  };

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
        {mergedData.map((point, i) => (
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
        {points.length > 1 &&
          points.slice(0, -1).map((start, i) => {
            const end = points[i + 1];
            const dir = new THREE.Vector3().subVectors(end, start).normalize();
            const length = start.distanceTo(end) - 2 * sphereRadius;
            const origin = new THREE.Vector3().addVectors(
              start,
              dir.clone().multiplyScalar(sphereRadius)
            );
            return (
              <arrowHelper
                key={i}
                args={[
                  dir,
                  origin,
                  length,
                  "white",
                  sphereRadius * 1.5,
                  sphereRadius * 0.75,
                ]}
              />
            );
          })}
        <axesHelper args={[8]} />
      </Canvas>
    </div>
  );
};

export default GeoScene;
