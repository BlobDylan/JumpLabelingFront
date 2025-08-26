export interface GeoPoint {
  lat: number;
  lon: number;
  time: number;
  label: 0 | 1;
}

export interface FileData {
  file_name: string;
  data: GeoPoint[];
}

export interface DirectoryData {
  dir_name: string;
  directories: DirectoryData[];
  files: FileData[];
}

export interface FileStatistics {
  total_label_0: number;
  total_label_1: number;
  total_samples: number;
}

export interface Statistics {
  total_label_0: number;
  total_label_1: number;
  total_samples: number;
  per_file: Record<string, FileStatistics>;
}
