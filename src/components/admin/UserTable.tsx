
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
  id: number;
  name: string;
  email: string;
  role: string;
  joinDate: string;
  lastLogin: string;
  totalOrders: number;
  totalSpent: number;
}

interface UserTableProps {
  users: User[];
  onRoleChange: (userId: number, newRole: string) => void;
  onDeleteUser: (userId: number) => void;
}

const UserTable = ({ users, onRoleChange, onDeleteUser }: UserTableProps) => {
  const getRoleBadge = (role: string) => {
    return role === 'admin' 
      ? <Badge className="bg-forest-600"><Shield className="h-3 w-3 mr-1" />Admin</Badge>
      : <Badge variant="secondary"><User className="h-3 w-3 mr-1" />User</Badge>;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Join Date</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Total Spent</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </TableCell>
            <TableCell>{getRoleBadge(user.role)}</TableCell>
            <TableCell>{user.joinDate}</TableCell>
            <TableCell>{user.totalOrders}</TableCell>
            <TableCell>Rp {user.totalSpent.toLocaleString()}</TableCell>
            <TableCell>
              <UserActions
                userId={user.id}
                userRole={user.role}
                onRoleChange={onRoleChange}
                onDeleteUser={onDeleteUser}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;
