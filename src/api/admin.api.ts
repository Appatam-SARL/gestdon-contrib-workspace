import { API_ROOT } from '@/config/app.config';
import {
  FormInviteRegisterUserValues,
  FormInviteValues,
} from '@/schema/admins.schema';
import { Mfa } from '@/store/mfa.store';
import { APIResponse } from '@/types/generic.type';
import {
  ReponseLoginByStaffWithMfa,
  StaffMember,
  StaffMemberForm,
} from '@/types/staff';
import { IUser, IUserFilterForm, ReponseLoginByUser } from '@/types/user';
import { AxiosError } from 'axios';
import { Axios, AxiosOffline } from '../config/axiosInstance';

// auth
export const login = async (data: {
  login: string;
  password: string;
}): Promise<ReponseLoginByUser> => {
  try {
    if (!data.login || !data.password) {
      throw new Error('Email and password are required');
    }
    console.log(data);
    const response = await Axios.post(`${API_ROOT.users}/login`, data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};

// logout by adminId
export const logoutByAdmin = async (): Promise<{
  message: string;
  logoutTime: string;
}> => {
  try {
    const response = await Axios.post(`${API_ROOT.users}/logout`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};

// mfa
export const setupMfa = async (userId: string): APIResponse<Mfa> => {
  try {
    const response = await Axios.post(`${API_ROOT.users}/mfa/${userId}/enable`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};

export const activateMfa = async (
  adminId: string,
  mfaToken: string
): Promise<{ message: string }> => {
  try {
    if (!adminId || !mfaToken) {
      throw new Error('AdminId and mfaToken are required');
    }

    const payload = {
      mfaToken: mfaToken,
    };

    const response = await Axios.post(
      `${API_ROOT.users}/${adminId}/mfa/activate`,
      payload
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};

export const deactivateMfa = async (
  adminId: string,
  data: {
    mfaToken: string;
  }
): Promise<ReponseLoginByStaffWithMfa> => {
  try {
    if (!adminId || !data.mfaToken) {
      throw new Error('AdminId and mfaToken are required');
    }
    const response = await Axios.post(
      `${API_ROOT.users}/${adminId}/mfa/deactivate`,
      data
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};

export const verifyMfa = async (data: {
  adminId: string;
  mfaToken: string;
}): Promise<{
  token: string;
  admin: StaffMember;
}> => {
  try {
    if (!data.adminId || !data.mfaToken) {
      throw new Error('AdminId and mfaToken are required');
    }
    console.log(data);
    const response = await Axios.post(`${API_ROOT.users}/verify-mfa`, data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};

// get all.users members
export const getStaffMembers = async (
  filter: IUserFilterForm
): APIResponse<IUser[]> => {
  try {
    const response = await Axios.get(`${API_ROOT.users}/`, {
      params: filter,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};

// get a.users member
export const getUserProfile = async (id: string) => {
  try {
    if (!id) {
      throw new Error('Id is required');
    }
    const response = await Axios.get(`${API_ROOT.users}/profile/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};

// update a.users member
export const updateUserProfile = async (id: string, data: StaffMemberForm) => {
  try {
    const response = await Axios.put(`${API_ROOT.users}/profile/${id}`, data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};

// update password
export const updatePassword = async (
  id: string,
  data: {
    currentPassword: string;
    newPassword: string;
  }
): Promise<{ message: string }> => {
  try {
    if (!id || !data.currentPassword || !data.newPassword) {
      throw new Error(
        'Id, currentPassword, newPassword and confirmPassword are required'
      );
    }
    const response = await Axios.put(`${API_ROOT.users}/password/${id}`, data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};

// create a new.users member
export const createUser = async (data: unknown) => {
  try {
    const response = await Axios.post(`${API_ROOT.users}/register`, data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};

// delete a.users member
export const deleteStaffMember = async (id: string) => {
  try {
    const response = await Axios.delete(`${API_ROOT.users}/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};

// verify account with token
export const verifyAccount = async (data: {
  token: string;
}): Promise<{
  message: string;
  admin: StaffMember;
  alreadyConfirmed: boolean;
}> => {
  try {
    if (!data.token) {
      throw new Error('Token is required');
    }
    const response = await AxiosOffline.get(
      `${API_ROOT.users}/verify-email/${data.token}`
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};

export const forgotPassword = async (data: { email: string }) => {
  try {
    const response = await Axios.post(
      `${API_ROOT.users}/forgot-password`,
      data
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};

export const resetPassword = async (data: {
  token: string;
  password: string;
}) => {
  try {
    const payload = {
      password: data.password,
    };
    const response = await Axios.post(
      API_ROOT.users + '/reset-password/' + data.token,
      payload
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};

export const findByToken = async (): Promise<{
  success: boolean;
  user: IUser;
  contributor: any;
}> => {
  try {
    const response = await Axios.get(`${API_ROOT.users}/check-auth/by-token`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};

export const inviteUser = async (id: string, data: FormInviteValues) => {
  try {
    const response = await Axios.post(
      `${API_ROOT.users}/invite-user/${id}`,
      data
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};

export const registerUserByInvite = async (
  token: string,
  data: FormInviteRegisterUserValues
) => {
  try {
    const response = await Axios.post(
      `${API_ROOT.users}/register-user-by-invite/${token}`,
      data
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};
