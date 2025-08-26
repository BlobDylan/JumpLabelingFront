import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import type { DirectoryData } from "../types";
import axios from "axios";
import { useData } from "../hooks/useData";

export default function FilesTreeView() {
  const { fetchData, setCurrentFileName, setOriginalFileName } = useData();
  const [directoryData, setDirectoryData] = useState<DirectoryData | null>(
    null
  );

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/list_files");
        setDirectoryData(response.data);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchFiles();
  }, []);

  // Recursive tree renderer for nested DirectoryData
  const renderTree = (data: DirectoryData, parentId = "") => {
    const nodeId = parentId ? `${parentId}/${data.dir_name}` : data.dir_name;
    return (
      <TreeItem itemId={nodeId} label={data.dir_name} key={nodeId}>
        {data.directories.map((dir) => renderTree(dir, nodeId))}
        {data.files.map((file) => {
          // Build the relative path from the root, always using forward slashes
          const relativePath = `${nodeId}/${file.file_name}`.replace(
            /^uploads\/?/,
            ""
          );
          const cleanPath = relativePath
            .replace(/\\/g, "/")
            .replace(".json", "");
          return (
            <TreeItem
              key={relativePath}
              itemId={relativePath}
              label={file.file_name.replace(".json", "")}
              onClick={() => {
                fetchData(cleanPath);
                setOriginalFileName(cleanPath);
                setCurrentFileName(cleanPath);
              }}
            />
          );
        })}
      </TreeItem>
    );
  };

  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <SimpleTreeView>
        {directoryData ? (
          renderTree(directoryData)
        ) : (
          <TreeItem itemId="loading" label="Loading..." />
        )}
      </SimpleTreeView>
    </Box>
  );
}
