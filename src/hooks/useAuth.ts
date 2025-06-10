
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthService, ForgotPasswordResponse } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const getErrorMessage = (error: any, fallbackMessage: string) => {
  // Check if error has errors array with messages
  if (error?.errors && Array.isArray(error.errors) && error.errors.length > 0) {
    return error.errors.map((err: any) => err.message || err).join(', ');
  }
  
  // Check response data for errors array
  if (error?.response?.data?.errors && Array.isArray(error.response.data.errors) && error.response.data.errors.length > 0) {
    return error.response.data.errors.map((err: any) => err.message || err).join(', ');
  }
  
  // Fallback to regular message
  return error?.response?.data?.message || error.message || fallbackMessage;
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      AuthService.login(email, password),
    onSuccess: (response) => {
      if (response.status) {
        // Store token and user data
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.account));
        
        const toastId = toast({
          title: "Login Berhasil",
          description: response.message || "Selamat datang kembali!",
          className: "bg-green-50 border-green-200 text-green-800",
        });

        setTimeout(() => {
          toastId.dismiss();
        }, 3000);

        // Redirect based on role
        if (response.data.account.role === 'Admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
        
        queryClient.invalidateQueries({ queryKey: ['user'] });
      } else {
        const errorMessage = getErrorMessage(response, response.message);
        const toastId = toast({
          title: "Login Gagal",
          description: errorMessage,
          className: "bg-red-50 border-red-200 text-red-800",
        });

        setTimeout(() => {
          toastId.dismiss();
        }, 3000);
      }
    },
    onError: (error: any) => {
      const errorMessage = getErrorMessage(error, "Terjadi kesalahan saat login");
      const toastId = toast({
        title: "Login Gagal",
        description: errorMessage,
        className: "bg-red-50 border-red-200 text-red-800",
      });

      setTimeout(() => {
        toastId.dismiss();
      }, 3000);
    },
  });
};

export const useRegister = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ 
      fullname, 
      phone, 
      email, 
      password, 
      confirmPassword 
    }: { 
      fullname: string; 
      phone: string; 
      email: string; 
      password: string; 
      confirmPassword: string; 
    }) =>
      AuthService.register(fullname, phone, email, password, confirmPassword),
    onSuccess: (response) => {
      if (response.status) {
        const toastId = toast({
          title: "Registrasi Berhasil",
          description: response.message || "Email verifikasi telah dikirim. Silakan cek email Anda.",
          className: "bg-green-50 border-green-200 text-green-800",
        });

        setTimeout(() => {
          toastId.dismiss();
        }, 3000);
      } else {
        const errorMessage = getErrorMessage(response, response.message);
        const toastId = toast({
          title: "Registrasi Gagal",
          description: errorMessage,
          className: "bg-red-50 border-red-200 text-red-800",
        });

        setTimeout(() => {
          toastId.dismiss();
        }, 3000);
      }
    },
    onError: (error: any) => {
      const errorMessage = getErrorMessage(error, "Terjadi kesalahan saat registrasi");
      const toastId = toast({
        title: "Registrasi Gagal",
        description: errorMessage,
        className: "bg-red-50 border-red-200 text-red-800",
      });

      setTimeout(() => {
        toastId.dismiss();
      }, 3000);
    },
  });
};

export const useVerify = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: ({ verificationCode }: { verificationCode: string }) =>
      AuthService.verify(verificationCode),
    onSuccess: (response) => {
      if (response.status) {
        const toastId = toast({
          title: "Verifikasi Berhasil",
          description: response.message || "Akun Anda telah diverifikasi. Silakan login.",
          className: "bg-green-50 border-green-200 text-green-800",
        });

        setTimeout(() => {
          toastId.dismiss();
        }, 3000);

        setTimeout(() => {
          navigate('/login');
        }, 2500);
      } else {
        const errorMessage = getErrorMessage(response, response.message);
        const toastId = toast({
          title: "Verifikasi Gagal",
          description: errorMessage,
          className: "bg-red-50 border-red-200 text-red-800",
        });

        setTimeout(() => {
          toastId.dismiss();
        }, 3000);

        setTimeout(() => {
          navigate('/login');
        }, 2500);
      }
    },
    onError: (error: any) => {
      const errorMessage = getErrorMessage(error, "Terjadi kesalahan saat verifikasi");
      const toastId = toast({
        title: "Verifikasi Gagal",
        description: errorMessage,
        className: "bg-red-50 border-red-200 text-red-800",
      });

      setTimeout(() => {
        toastId.dismiss();
      }, 3000);

      setTimeout(() => {
        navigate('/login');
      }, 2500);
    },
  });
};

export const useResetPassword = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ email }: { email: string }) =>
      AuthService.forgotPassword(email),
    onSuccess: (response: ForgotPasswordResponse) => {
      if (response.status) {
        const toastId = toast({
          title: "Reset Password Berhasil",
          description: response.message || "Link reset password telah dikirim ke email Anda.",
          className: "bg-green-50 border-green-200 text-green-800",
        });

        setTimeout(() => {
          toastId.dismiss();
        }, 3000);
      } else {
        const errorMessage = getErrorMessage(response, response.message);
        const toastId = toast({
          title: "Reset Password Gagal",
          description: errorMessage,
          className: "bg-red-50 border-red-200 text-red-800",
        });

        setTimeout(() => {
          toastId.dismiss();
        }, 3000);
      }
    },
    onError: (error: any) => {
      const errorMessage = getErrorMessage(error, "Terjadi kesalahan saat reset password");
      const toastId = toast({
        title: "Reset Password Gagal",
        description: errorMessage,
        className: "bg-red-50 border-red-200 text-red-800",
      });

      setTimeout(() => {
        toastId.dismiss();
      }, 3000);
    },
  });
};

export const useLogout = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  return () => {
    AuthService.logout();
    const toastId = toast({
      title: "Logout Berhasil",
      description: "Anda telah berhasil logout.",
      className: "bg-green-50 border-green-200 text-green-800",
    });

    setTimeout(() => {
      toastId.dismiss();
    }, 3000);
    
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };
};

export const useForgotPassword = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ email }: { email: string }) =>
      AuthService.forgotPassword(email),
    onSuccess: (response: ForgotPasswordResponse) => {
      if (response.status) {
        const toastId = toast({
          title: "Email Terkirim",
          description: response.message || "Link reset password telah dikirim ke email Anda.",
          className: "bg-green-50 border-green-200 text-green-800",
        });

        setTimeout(() => {
          toastId.dismiss();
        }, 3000);
      } else {
        const errorMessage = getErrorMessage(response, response.message);
        const toastId = toast({
          title: "Gagal Mengirim Email",
          description: errorMessage,
          className: "bg-red-50 border-red-200 text-red-800",
        });

        setTimeout(() => {
          toastId.dismiss();
        }, 3000);
      }
    },
    onError: (error: any) => {
      const errorMessage = getErrorMessage(error, "Terjadi kesalahan saat mengirim email reset password");
      const toastId = toast({
        title: "Gagal Mengirim Email",
        description: errorMessage,
        className: "bg-red-50 border-red-200 text-red-800",
      });

      setTimeout(() => {
        toastId.dismiss();
      }, 3000);
    },
  });
};

export const useResetPasswordWithCode = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: ({ 
      code, 
      password, 
      confirmPassword 
    }: { 
      code: string; 
      password: string; 
      confirmPassword: string; 
    }) =>
      AuthService.resetPasswordWithCode(code, password, confirmPassword),
    onSuccess: (response) => {
      if (response.status) {
        const toastId = toast({
          title: "Password Berhasil Direset",
          description: response.message || "Password Anda telah berhasil direset. Silakan login dengan password baru.",
          className: "bg-green-50 border-green-200 text-green-800",
        });

        setTimeout(() => {
          toastId.dismiss();
        }, 3000);

        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        const errorMessage = getErrorMessage(response, response.message);
        const toastId = toast({
          title: "Reset Password Gagal",
          description: errorMessage,
          className: "bg-red-50 border-red-200 text-red-800",
        });

        setTimeout(() => {
          toastId.dismiss();
        }, 3000);
      }
    },
    onError: (error: any) => {
      const errorMessage = getErrorMessage(error, "Terjadi kesalahan saat reset password");
      const toastId = toast({
        title: "Reset Password Gagal",
        description: errorMessage,
        className: "bg-red-50 border-red-200 text-red-800",
      });

      setTimeout(() => {
        toastId.dismiss();
      }, 3000);
    },
  });
};
