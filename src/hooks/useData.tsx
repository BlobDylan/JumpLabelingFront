import { createContext, useContext, useState, type ReactNode } from "react";
import type { GeoPoint, Statistics } from "../types";
import axios from "axios";

interface DataContextType {
  data: GeoPoint[];
  originalFileName: string;
  currentFileName: string;
  statistics: Statistics | null;
  fetchData: (filename: string) => Promise<void>;
  fetchStatistics: () => Promise<void>;
  setCurrentFileName: (filename: string) => void;
  setOriginalFileName: (filename: string) => void;
  updateData: (newData: GeoPoint[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<GeoPoint[]>([]);
  const [originalFileName, setOriginalFileName] = useState<string>("");
  const [currentFileName, setCurrentFileName] = useState<string>("");
  const [statistics, setStatistics] = useState<Statistics | null>(null);

  const fetchData = async (filename: string) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/file_data?filename=${filename}.json`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching file data:", error);
      setData([]);
    }
  };

  const updateData = (newData: GeoPoint[]) => {
    setData(newData);
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/statistics");
      setStatistics(response.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      setStatistics(null);
    }
  };

  return (
    <DataContext.Provider
      value={{
        data,
        statistics,
        originalFileName,
        currentFileName,
        fetchData,
        fetchStatistics,
        setCurrentFileName,
        setOriginalFileName,
        updateData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
