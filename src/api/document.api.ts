import { API_ROOT } from '@/config/app.config';
import { Axios } from '@/config/axiosInstance';
import { IDocument } from '@/types/document';

export const uploadDocument = async (
  data: IDocument
): Promise<{
  success: string;
  data: IDocument;
}> => {
  try {
    if (!data.fileUrl) {
      throw new Error('Veuillez sélectionner un fichier');
    }
    const response = await Axios.post(`${API_ROOT.documents}`, data, {});
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};

export const createManyDocuments = async (
  documents: IDocument[]
): Promise<{
  data: { documents: IDocument[] };
  status: string;
  results: number;
}> => {
  try {
    const response = await Axios.post(
      `${API_ROOT.documents}/create-many`,
      documents,
      {}
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

export const getDocuments = async (
  id: string,
  ownerType: string
): Promise<{
  data: { documents: IDocument[] };
  status: string;
  results: number;
}> => {
  try {
    if (!id) {
      throw new Error(
        'Veuillez ID de partenaire est requis pour cette requête'
      );
    }
    const response = await Axios.get(
      `${API_ROOT.documents}/${ownerType}/${id}`,
      {}
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

export const getDocumentById = async (
  id: string
): Promise<{
  data: { document: IDocument };
  status: string;
  results: number;
}> => {
  try {
    if (!id) {
      throw new Error('Veuillez ID du document est requis pour cette requête');
    }
    const response = await Axios.get(`${API_ROOT.documents}/${id}`, {});
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};

export const verifyDocument = async (
  id: string
): Promise<{
  success: string;
  message: string;
  data: IDocument;
}> => {
  try {
    if (!id) {
      throw new Error('Veuillez ID du document est requis pour cette requête');
    }
    const response = await Axios.patch(`${API_ROOT.documents}/${id}/verify`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};

export const rejectDocument = async (
  id: string,
  reason: string
): Promise<{
  success: string;
  message: string;
  data: IDocument;
}> => {
  try {
    if (!id) {
      throw new Error('Veuillez ID du document est requis pour cette requête');
    }
    const payload = {
      reason,
    };
    const response = await Axios.patch(
      `${API_ROOT.documents}/${id}/reject`,
      payload
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
