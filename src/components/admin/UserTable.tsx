
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Shield, User } from 'lucide-react';
import UserActions from './UserActions';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  gender?: string;
  joinDate: string;
  lastLogin: string;
}

interface UserTableProps {
  users: User[];
  onRoleChange: (userId: string, newRole: string) => void;
}

const UserTable = ({ users, onRoleChange }: UserTableProps) => {
  const getRoleBadge = (role: string) => {
    return role === 'Admin'
      ? <Badge className="bg-forest-600"><Shield className="h-3 w-3 mr-1" />Admin</Badge>
      : <Badge variant="secondary"><User className="h-3 w-3 mr-1" />User</Badge>;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fullname</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Gender</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Join Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <p className="font-medium">{user.name}</p>
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.gender}</TableCell>
            <TableCell>{getRoleBadge(user.role)}</TableCell>
            <TableCell>{user.joinDate}</TableCell>
            <TableCell>
              <UserActions
                userId={user.id}
                userRole={user.role}
                onRoleChange={onRoleChange}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;
