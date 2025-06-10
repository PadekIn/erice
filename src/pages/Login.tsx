import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLogin, useRegister, useForgotPassword } from '@/hooks/useAuth';
import { AuthService } from '@/services/authService';

const Login = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const forgotPasswordMutation = useForgotPassword();

  const [activeTab, setActiveTab] = useState('login');
  const [showResetPassword, setShowResetPassword] = useState(false);

  // Check if user is already authenticated
  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      const user = AuthService.getStoredUser();
      if (user?.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [navigate]);

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    fullname: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [resetForm, setResetForm] = useState({
    email: ''
  });

  // Phone number validation
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // If starts with 62, remove it (we'll add it back)
    const withoutCountryCode = digits.startsWith('62') ? digits.slice(2) : digits;
    
    // Limit to 12 digits after country code (62)
    const limited = withoutCountryCode.slice(0, 12);
    
    return limited;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setRegisterForm({ ...registerForm, phone: formatted });
  };

  const validatePhoneNumber = (phone: string) => {
    // Should be 8-12 digits after 62
    return phone.length >= 8 && phone.length <= 12;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginForm);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerForm.password !== registerForm.confirmPassword) {
      return;
    }

    if (!validatePhoneNumber(registerForm.phone)) {
      return;
    }

    const fullPhoneNumber = `62${registerForm.phone}`;

    registerMutation.mutate({
      fullname: registerForm.fullname,
      phone: fullPhoneNumber,
      email: registerForm.email,
      password: registerForm.password,
      confirmPassword: registerForm.confirmPassword
    });
  };

  // Clear form and redirect on successful registration
  useEffect(() => {
    if (registerMutation.isSuccess && registerMutation.data?.status) {
      // Clear the form
      setRegisterForm({
        fullname: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
      // Switch to login tab after 1 second
      setTimeout(() => {
        setActiveTab('login');
      }, 1000);
    }
  }, [registerMutation.isSuccess, registerMutation.data]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    forgotPasswordMutation.mutate({ email: resetForm.email });
  };

  // Clear form on successful forgot password
  useEffect(() => {
    if (forgotPasswordMutation.isSuccess && forgotPasswordMutation.data?.status) {
      // Clear the form
      setResetForm({ email: '' });
      
      // Switch back to login tab after 1 second
      setTimeout(() => {
        setShowResetPassword(false);
      }, 1000);
    }
  }, [forgotPasswordMutation.isSuccess, forgotPasswordMutation.data]);

  if (showResetPassword) {
    return (
      <>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-forest-800 mb-2">
                Reset Password
              </h1>
              <p className="text-muted-foreground">
                Masukkan email Anda untuk menerima link reset password
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-center text-forest-800">Reset Password</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="Masukkan email Anda"
                      value={resetForm.email}
                      onChange={(e) => setResetForm({...resetForm, email: e.target.value})}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-forest-600 hover:bg-forest-700"
                    disabled={forgotPasswordMutation.isPending}
                  >
                    {forgotPasswordMutation.isPending ? 'Mengirim...' : 'Kirim Link Reset'}
                  </Button>
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setShowResetPassword(false)}
                      className="text-forest-600 hover:underline"
                    >
                      Kembali ke Login
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-forest-800 mb-2">
              Selamat Datang
            </h1>
            <p className="text-muted-foreground">
              Login atau daftar untuk melanjutkan berbelanja
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Daftar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center text-forest-800">Login</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Masukkan email Anda"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Masukkan password Anda"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-forest-600 hover:bg-forest-700"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? 'Loading...' : 'Login'}
                    </Button>
                    <div className="text-center">
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setShowResetPassword(true)}
                        className="text-forest-600 hover:underline"
                      >
                        Lupa password?
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center text-forest-800">Daftar Akun Baru</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Nama Lengkap</Label>
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Masukkan nama lengkap Anda"
                        value={registerForm.fullname}
                        onChange={(e) => setRegisterForm({...registerForm, fullname: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-phone">Nomor Telepon</Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground">
                          +62
                        </span>
                        <Input
                          id="register-phone"
                          type="tel"
                          placeholder="8132xxxxxx"
                          value={registerForm.phone}
                          onChange={handlePhoneChange}
                          className="rounded-l-none"
                          required
                        />
                      </div>
                      {registerForm.phone && !validatePhoneNumber(registerForm.phone) && (
                        <p className="text-sm text-red-500">Nomor telepon harus 8-12 digit</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Masukkan email Anda"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Masukkan password Anda"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password">Konfirmasi Password</Label>
                      <Input
                        id="register-confirm-password"
                        type="password"
                        placeholder="Konfirmasi password Anda"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-forest-600 hover:bg-forest-700"
                      disabled={registerMutation.isPending || (registerForm.phone && !validatePhoneNumber(registerForm.phone))}
                    >
                      {registerMutation.isPending ? 'Loading...' : 'Daftar'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Login;
