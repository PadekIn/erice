/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserFilters from '@/components/admin/UserFilters';
import UserTable from '@/components/admin/UserTable';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  fullname: string;
  gender: string;
  Account: {
    id: string;
    email: string;
    role: string;
    createdAt: string;
  };
}

interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: string;
  gender?: string;
  joinDate: string;
  lastLogin: string;
  totalOrders: number;
  totalSpent: number;
}

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch users from API
  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/users`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok) {
          // Transform API data to match component expectations
          const transformedUsers: ApiUser[] = data.data.map((user: User) => ({
            id: user.Account.id,
            name: user.fullname,
            email: user.Account.email,
            role: user.Account.role,
            gender: user.gender,
            joinDate: new Date(user.Account.createdAt).toLocaleDateString('id-ID'),
            lastLogin: new Date(user.Account.createdAt).toLocaleDateString('id-ID'), // Using createdAt as fallback
          }));
          setUsers(transformedUsers);
        } else {
          const errorMessage = data.errors && data.errors.length > 0
            ? data.errors.map((err: any) => err.message || err).join(', ')
            : data.message || `HTTP error! status: ${response.status}`;

          const error = new Error(errorMessage);
          (error as any).response = { data };
          (error as any).errors = data.errors;
          throw error;
        }
      } catch (error: any) {
        console.error('Error fetching users:', error);
        toast({
          title: "Gagal Memuat Data User",
          description: error.message || "Terjadi kesalahan saat memuat data user",
          className: "bg-red-50 border-red-200 text-red-800",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update local state
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );

        toast({
          title: "Role Berhasil Diubah",
          description: `User berhasil diupgrade menjadi ${newRole}`,
          className: "bg-green-50 border-green-200 text-green-800",
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Gagal Mengubah Role",
        description: error.message || "Terjadi kesalahan saat mengubah role user",
        className: "bg-red-50 border-red-200 text-red-800",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-forest-800">User Management</h1>
        </div>
        <div className="text-center py-8">Loading users...</div>
      </div>
    );
  }

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
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
