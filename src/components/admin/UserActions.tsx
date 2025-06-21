
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { UserCog, Trash2 } from 'lucide-react';

interface UserActionsProps {
  userId: string;
  userRole: string;
  onRoleChange: (userId: string, newRole: string) => void;
}

const UserActions = ({ userId, userRole, onRoleChange }: UserActionsProps) => {
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);

  const handleRoleChange = () => {
    onRoleChange(userId, userRole === 'Admin' ? 'User' : 'Admin');
    setIsRoleDialogOpen(false);
  };

  return (
    <div className="flex space-x-2">
      <AlertDialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm">
            <UserCog className="h-4 w-4 mr-1" />
            {userRole === 'Admin' ? 'Make User' : 'Make Admin'}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change User Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change this user's role to {userRole === 'Admin' ? 'User' : 'Admin'}?
              This action will modify their access permissions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRoleChange} className="bg-forest-600 hover:bg-forest-700">
              Change Role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserActions;
