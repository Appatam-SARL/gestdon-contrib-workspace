import { API_ROOT } from '@/config/app.config';
import { Axios, AxiosDoc } from '@/config/axiosInstance';
import { tFile } from '@/types/file';

export const uploadFile = async (
  file: FormData,
  folder: string
): Promise<{
  success: boolean;
  message: string;
  filesData: tFile[];
}> => {
  try {
    const response = await AxiosDoc.post(
      `${API_ROOT.files}/upload/${folder}`,
      file,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};

export const downloadFile = async (
  fileId: string,
  filename: string
): Promise<{
  success: string;
  message: string;
}> => {
  try {
    const response = await AxiosDoc.get(
      `${API_ROOT.files}/download/${fileId}`,
      {
        responseType: 'blob',
      }
    );
    const blob = await response.data;
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};

export const getFileUrl = async (fileId: string): Promise<string> => {
  try {
    const response = await AxiosDoc.get(
      `${API_ROOT.files}/download/${fileId}`,
      {
        responseType: 'blob',
      }
    );
    const blob = response.data;
    const objectUrl = window.URL.createObjectURL(blob);
    return objectUrl; // Tu utilises cette URL dans un <img src={objectUrl} />
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};

export const getMultipeFile = async (fileIds: string[]) => {
  try {
    const response = await Axios.post(
      `${API_ROOT.files}/metadata`,
      { fileIds },
      {
        responseType: 'blob',
      }
    );
    const blob = response.data;
    const objectUrl = window.URL.createObjectURL(blob);
    return objectUrl; // Tu utilises cette URL dans un <img src={objectUrl} />
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};
