
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { AuthService } from '@/services/authService';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      toast({
        title: "Access Denied",
        description: "Please login to access admin panel",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    const user = AuthService.getStoredUser();
    if (!user || user.role !== 'Admin') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access admin panel",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
  }, [navigate, toast]);

  if (!AuthService.isAuthenticated()) {
    return null;
  }

  const user = AuthService.getStoredUser();
  if (!user || user.role !== 'Admin') {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
