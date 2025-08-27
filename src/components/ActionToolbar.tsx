import { Button, Stack, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import axios from "axios";
import { useData } from "../hooks/useData";
import { enqueueSnackbar, useSnackbar } from "notistack";
const API_URL = import.meta.env.VITE_API_URL;

const handleFileUpload = async (
  files: File[] | FileList | null,
  setOriginalFileName: (filename: string) => void,
  setCurrentFileName: (filename: string) => void,
  updateData: (data: any[]) => void
) => {
  if (!files) return;
  const filesArray = Array.from(files);
  for (const file of filesArray) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", file.name);
    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateData(response.data.data);
      setOriginalFileName(response.data.filename.replace(/\.[^/.]+$/, ""));
      setCurrentFileName(response.data.filename.replace(/\.[^/.]+$/, ""));
      enqueueSnackbar(
        `File ${response.data.filename} uploaded and loaded successfully`,
        { variant: "success" }
      );
    } catch (error) {
      enqueueSnackbar("Error uploading/loading file", { variant: "error" });
    }
  }
};

const ActionToolbar = () => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    originalFileName,
    setOriginalFileName,
    currentFileName,
    setCurrentFileName,
    data,
    updateData,
  } = useData();

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("filename", originalFileName + ".json");
      formData.append("new_filename", currentFileName + ".json");
      formData.append("data", JSON.stringify(data));

      await axios.post(`${API_URL}/save_data`, formData);
      setOriginalFileName(currentFileName);
      enqueueSnackbar("Data saved successfully", { variant: "success" });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        enqueueSnackbar(error.response.data, { variant: "error" });
      } else {
        enqueueSnackbar("An unexpected error occurred", { variant: "error" });
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(
      event.target.files,
      setOriginalFileName,
      setCurrentFileName,
      updateData
    );
  };

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ mt: 2, mb: 2 }}
      >
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Save
        </Button>
        <TextField
          variant="outlined"
          size="small"
          value={currentFileName}
          sx={{ flexGrow: 1, ml: 2, mr: 2 }}
          onChange={(e) =>
            setCurrentFileName(e.target.value.replace(".json", ""))
          }
        />
        <label htmlFor="file-upload">
          <input
            id="file-upload"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
            multiple
          />
          <Button
            variant="outlined"
            startIcon={<FileUploadIcon />}
            component="span"
          >
            Upload File
          </Button>
        </label>
      </Stack>
    </>
  );
};

export default ActionToolbar;
