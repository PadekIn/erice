
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserFilters from '@/components/admin/UserFilters';
import UserTable from '@/components/admin/UserTable';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Mock data - replace with actual API calls
  const users = [
    {
      id: 1,
      name: 'Ahmad Rizki',
      email: 'ahmad@email.com',
      role: 'user',
      joinDate: '2024-01-15',
      lastLogin: '2024-05-27',
      totalOrders: 12,
      totalSpent: 1450000
    },
    {
      id: 2,
      name: 'Siti Nurhaliza',
      email: 'siti@email.com',
      role: 'user',
      joinDate: '2024-02-20',
      lastLogin: '2024-05-26',
      totalOrders: 8,
      totalSpent: 850000
    },
    {
      id: 3,
      name: 'Admin User',
      email: 'admin@berasindragiri.com',
      role: 'admin',
      joinDate: '2023-12-01',
      lastLogin: '2024-05-27',
      totalOrders: 0,
      totalSpent: 0
    },
    {
      id: 4,
      name: 'Budi Santoso',
      email: 'budi@email.com',
      role: 'user',
      joinDate: '2024-03-10',
      lastLogin: '2024-05-25',
      totalOrders: 15,
      totalSpent: 2100000
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = (userId: number, newRole: string) => {
    if (confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      console.log('Change role for user:', userId, 'to:', newRole);
      // Implement role change logic here
    }
  };

  const handleDeleteUser = (userId: number) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      console.log('Delete user:', userId);
      // Implement delete logic here
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-forest-800">User Management</h1>
      </div>

      <UserFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
      />

      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <UserTable
            users={filteredUsers}
            onRoleChange={handleRoleChange}
            onDeleteUser={handleDeleteUser}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
