
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useResetPasswordWithCode } from '@/hooks/useAuth';

const ResetPassword = () => {
  const { code } = useParams<{ code: string }>();
  const resetPasswordMutation = useResetPasswordWithCode();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }

    if (code) {
      resetPasswordMutation.mutate({
        code,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-forest-800 mb-2">
              Reset Password
            </h1>
            <p className="text-muted-foreground">
              Masukkan password baru Anda
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center text-forest-800">Password Baru</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password Baru</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Masukkan password baru"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Konfirmasi password baru"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    required
                    minLength={6}
                  />
                  {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-sm text-red-500">Password tidak cocok</p>
                  )}
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-forest-600 hover:bg-forest-700"
                  disabled={
                    resetPasswordMutation.isPending || 
                    !formData.password || 
                    !formData.confirmPassword ||
                    formData.password !== formData.confirmPassword
                  }
                >
                  {resetPasswordMutation.isPending ? 'Mereset Password...' : 'Reset Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
