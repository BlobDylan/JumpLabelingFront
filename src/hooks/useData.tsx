import { createContext, useContext, useState, type ReactNode } from "react";
import type { GeoPoint, Statistics } from "../types";
import { useAuth } from "./useAuth";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface DataContextType {
  data: GeoPoint[];
  isDataLoading: boolean;
  isStatisticsLoading: boolean;
  originalFileName: string;
  currentFileName: string;
  statistics: Statistics | null;
  fetchData: (filename: string) => Promise<void>;
  fetchStatistics: () => Promise<void>;
  setCurrentFileName: (filename: string) => void;
  setOriginalFileName: (filename: string) => void;
  setIsDataLoading: (isLoading: boolean) => void;
  setIsStatisticsLoading: (isLoading: boolean) => void;
  updateData: (newData: GeoPoint[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<GeoPoint[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [isStatisticsLoading, setIsStatisticsLoading] =
    useState<boolean>(false);
  const [originalFileName, setOriginalFileName] = useState<string>("");
  const [currentFileName, setCurrentFileName] = useState<string>("");
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const { token } = useAuth();

  const fetchData = async (filename: string) => {
    if (!token) {
      console.error("No authentication token found");
      return;
    }
    try {
      setIsDataLoading(true);
      const response = await axios.get(
        `${API_URL}/file_data?filename=${filename}.json`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
    if (!token) {
      console.error("No authentication token found");
      return;
    }
    try {
      setIsStatisticsLoading(true);
      const response = await axios.get(`${API_URL}/statistics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStatistics(response.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      setStatistics(null);
    } finally {
      setIsStatisticsLoading(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        data,
        isDataLoading,
        isStatisticsLoading,
        statistics,
        originalFileName,
        currentFileName,
        fetchData,
        fetchStatistics,
        setCurrentFileName,
        setOriginalFileName,
        setIsDataLoading,
        setIsStatisticsLoading,
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
