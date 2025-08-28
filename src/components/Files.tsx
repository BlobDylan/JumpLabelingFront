import { useEffect, useState } from "react";
import { Box, Stack, Button, CircularProgress } from "@mui/material";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import type { DirectoryData } from "../types";
import axios from "axios";
import { useData } from "../hooks/useData";
import { useAuth } from "../hooks/useAuth";
import DeleteIcon from "@mui/icons-material/Delete";

const API_URL = import.meta.env.VITE_API_URL;

export default function FilesTreeView() {
  const { fetchData, setCurrentFileName, setOriginalFileName } = useData();
  const [directoryData, setDirectoryData] = useState<DirectoryData | null>(
    null
  );
  const { token } = useAuth();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`${API_URL}/list_files`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDirectoryData(response.data);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchFiles();
  }, []);

  const [isDeleting, setIsDeleting] = useState<string[]>([]);

  const deleteFile = async (filePath: string) => {
    setIsDeleting((prev) => [...prev, filePath]);
    try {
      const cleanFileName = filePath.replace(/\.json$/, "");
      await axios.delete(`${API_URL}/delete_file`, {
        params: { filename: cleanFileName },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      try {
        const response = await axios.get(`${API_URL}/list_files`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDirectoryData(response.data);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    } finally {
      setIsDeleting((prev) => prev.filter((path) => path !== filePath));
    }
  };

  // Recursive tree renderer for nested DirectoryData
  const renderTree = (data: DirectoryData, parentId = "") => {
    const nodeId = parentId ? `${parentId}/${data.dir_name}` : data.dir_name;
    // Remove leading slash if parentId is empty or data.dir_name is empty
    const safeNodeId = nodeId.replace(/^\//, "");
    return (
      <TreeItem itemId={safeNodeId} label={data.dir_name} key={safeNodeId}>
        {data.directories.map((dir) => renderTree(dir, safeNodeId))}
        {data.files.map((file) => {
          // Build the relative path from the root, always using forward slashes
          const relativePath = safeNodeId
            ? `${safeNodeId}/${file.file_name}`
            : file.file_name;
          const trimmedPath = relativePath.replace(/^\//, "");
          const cleanPath = trimmedPath
            .replace(/\\/g, "/")
            .replace(".json", "");
          return (
            <Stack
              direction="row"
              alignItems="center"
              sx={{ justifyContent: "space-between" }}
              key={trimmedPath}
            >
              <TreeItem
                key={trimmedPath}
                itemId={trimmedPath}
                label={file.file_name.replace(".json", "")}
                sx={{ flexGrow: 1 }}
                disabled={isDeleting.includes(trimmedPath)}
                onClick={() => {
                  fetchData(cleanPath);
                  setOriginalFileName(cleanPath);
                  setCurrentFileName(cleanPath);
                }}
              />
              <Button
                disableRipple
                onClick={() => deleteFile(trimmedPath)}
                disabled={trimmedPath in isDeleting}
              >
                {isDeleting.includes(trimmedPath) ? (
                  <CircularProgress size={24} />
                ) : (
                  <DeleteIcon />
                )}
              </Button>
            </Stack>
          );
        })}
      </TreeItem>
    );
  };

  return (
    <Box sx={{ minWidth: 250 }}>
      <SimpleTreeView>
        {directoryData ? (
          renderTree(directoryData)
        ) : (
          <TreeItem itemId="loading" label="Loading..." sx={{ flexGrow: 1 }} />
        )}
      </SimpleTreeView>
    </Box>
  );
}
