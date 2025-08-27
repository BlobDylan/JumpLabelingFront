import { createContext, useContext, useState, type ReactNode } from "react";
import type { GeoPoint, Statistics } from "../types";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface DataContextType {
  data: GeoPoint[];
  isDataLoading: boolean;
  originalFileName: string;
  currentFileName: string;
  statistics: Statistics | null;
  fetchData: (filename: string) => Promise<void>;
  fetchStatistics: () => Promise<void>;
  setCurrentFileName: (filename: string) => void;
  setOriginalFileName: (filename: string) => void;
  setIsDataLoading: (isLoading: boolean) => void;
  updateData: (newData: GeoPoint[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<GeoPoint[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [originalFileName, setOriginalFileName] = useState<string>("");
  const [currentFileName, setCurrentFileName] = useState<string>("");
  const [statistics, setStatistics] = useState<Statistics | null>(null);

  const fetchData = async (filename: string) => {
    try {
      setIsDataLoading(true);
      const response = await axios.get(
        `${API_URL}/file_data?filename=${filename}.json`
      );
      setData(response.data);
      setIsDataLoading(false);
    } catch (error) {
      console.error("Error fetching file data:", error);
      setData([]);
      setIsDataLoading(false);
    }
  };

  const updateData = (newData: GeoPoint[]) => {
    setData(newData);
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${API_URL}/statistics`);
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
        isDataLoading,
        statistics,
        originalFileName,
        currentFileName,
        fetchData,
        fetchStatistics,
        setCurrentFileName,
        setOriginalFileName,
        setIsDataLoading,
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
