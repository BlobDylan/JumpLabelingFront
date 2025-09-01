import { createContext, useContext, useState, type ReactNode } from "react";
import type { GeoPoint, Statistics, DirectoryData } from "../types";
import { useAuth } from "./useAuth";
import axios from "axios";
import { useSnackbar } from "notistack";

const API_URL = import.meta.env.VITE_API_URL;

interface DataContextType {
  data: GeoPoint[];
  directoryData: DirectoryData | null;
  isDataLoading: boolean;
  isStatisticsLoading: boolean;
  originalFileName: string;
  currentFileName: string;
  statistics: Statistics | null;
  fetchData: (filename: string) => Promise<void>;
  fetchStatistics: () => Promise<void>;
  fetchDirectoryData: () => Promise<void>;
  setCurrentFileName: (filename: string) => void;
  setOriginalFileName: (filename: string) => void;
  setIsDataLoading: (isLoading: boolean) => void;
  setIsStatisticsLoading: (isLoading: boolean) => void;
  updateData: (newData: GeoPoint[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<GeoPoint[]>([]);
  const [directoryData, setDirectoryData] = useState<DirectoryData | null>(
    null
  );
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [isStatisticsLoading, setIsStatisticsLoading] =
    useState<boolean>(false);
  const [originalFileName, setOriginalFileName] = useState<string>("");
  const [currentFileName, setCurrentFileName] = useState<string>("");
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const { token, unauthorizedFallback } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

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
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        enqueueSnackbar("Session expired", { variant: "error" });
        unauthorizedFallback();
      } else {
        enqueueSnackbar("Error fetching file data", { variant: "error" });
      }
      setData([]);
      setIsDataLoading(false);
    }
  };

  const fetchDirectoryData = async () => {
    try {
      const response = await axios.get(`${API_URL}/list_files`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDirectoryData(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        enqueueSnackbar("Session expired", { variant: "error" });
        unauthorizedFallback();
      } else {
        enqueueSnackbar("Error fetching directory data", { variant: "error" });
      }
      setDirectoryData(null);
    }
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
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        enqueueSnackbar("Session expired", { variant: "error" });
        unauthorizedFallback();
      } else {
        enqueueSnackbar("Error fetching statistics", { variant: "error" });
      }
      setStatistics(null);
    } finally {
      setIsStatisticsLoading(false);
    }
  };

  const updateData = (newData: GeoPoint[]) => {
    setData(newData);
  };

  return (
    <DataContext.Provider
      value={{
        data,
        directoryData,
        isDataLoading,
        isStatisticsLoading,
        statistics,
        originalFileName,
        currentFileName,
        fetchData,
        fetchStatistics,
        fetchDirectoryData,
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
