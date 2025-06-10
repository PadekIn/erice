
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useVerify } from '@/hooks/useAuth';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const verifyMutation = useVerify();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  
  const verificationCode = searchParams.get('code');

  useEffect(() => {
    if (verificationCode) {
      verifyMutation.mutate(
        { verificationCode },
        {
          onSuccess: (response) => {
            if (response.status) {
              setVerificationStatus('success');
            } else {
              setVerificationStatus('error');
            }
          },
          onError: () => {
            setVerificationStatus('error');
          }
        }
      );
    } else {
      setVerificationStatus('error');
    }
  }, [verificationCode]);

  const renderContent = () => {
    switch (verificationStatus) {
      case 'loading':
        return (
          <div className="text-center">
            <Loader2 className="h-16 w-16 animate-spin text-forest-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-forest-800 mb-2">Memverifikasi Akun</h2>
            <p className="text-muted-foreground">Mohon tunggu, sedang memverifikasi email Anda...</p>
          </div>
        );
      
      case 'success':
        return (
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-forest-800 mb-2">Verifikasi Berhasil!</h2>
            <p className="text-muted-foreground mb-4">
              Email Anda telah berhasil diverifikasi. Anda akan dialihkan ke halaman login untuk masuk ke akun Anda.
            </p>
            <p className="text-sm text-muted-foreground">
              Anda akan dialihkan ke halaman login dalam beberapa detik...
            </p>
          </div>
        );
      
      case 'error':
        return (
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-forest-800 mb-2">Verifikasi Gagal</h2>
            <p className="text-muted-foreground mb-4">
              Maaf, terjadi kesalahan saat memverifikasi email Anda. 
              Link verifikasi mungkin sudah kadaluarsa atau tidak valid.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Anda akan dialihkan ke halaman login dalam beberapa detik...
            </p>
            <Button 
              onClick={() => window.location.href = '/login'}
              className="bg-forest-600 hover:bg-forest-700"
            >
              Kembali ke Login
            </Button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-forest-800">Verifikasi Email</CardTitle>
            </CardHeader>
            <CardContent className="py-8">
              {renderContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default EmailVerification;
