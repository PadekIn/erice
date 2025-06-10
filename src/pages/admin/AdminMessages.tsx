
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Search, Eye, Trash2, Mail, MailOpen } from 'lucide-react';
import { useContactMessages } from '@/hooks/useContact';
import { ContactMessage } from '@/services/contactService';

const AdminMessages = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const { data: messagesResponse, isLoading, error } = useContactMessages();
  const messages = messagesResponse?.data || [];

  const filteredMessages = messages.filter(message => {
    const matchesSearch =
      message.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleDelete = (messageId: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      console.log('Delete message:', messageId);
      // Implement delete logic here when endpoint is available
    }
  };

  const MessageDetails = ({ message }: { message: ContactMessage }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium text-forest-800 mb-2">From</h3>
          <p className="text-sm">{message.fullname}</p>
          <p className="text-sm text-gray-500">{message.email}</p>
          {message.phone && <p className="text-sm text-gray-500">{message.phone}</p>}
        </div>
        <div>
          <h3 className="font-medium text-forest-800 mb-2">Message ID</h3>
          <p className="text-sm">{message.id}</p>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-forest-800 mb-2">Subject</h3>
        <p className="text-sm font-medium">{message.subject}</p>
      </div>

      <div>
        <h3 className="font-medium text-forest-800 mb-2">Message</h3>
        <div className="text-sm text-gray-600 bg-rice-50 p-4 rounded-lg border">
          {message.message}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => window.open(`mailto:${message.email}?subject=Re: ${message.subject}`)}
          className="text-forest-600 border-forest-600 hover:bg-forest-50"
        >
          <Mail className="h-4 w-4 mr-2" />
          Reply
        </Button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-forest-800">Contact Messages</h1>
        <Card>
          <CardContent className="p-8 text-center">
            <p>Loading messages...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-forest-800">Contact Messages</h1>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-red-600">Error loading messages: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-forest-800">Contact Messages</h1>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Messages ({filteredMessages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Reply</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMessages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{message.fullname}</p>
                      <p className="text-sm text-gray-500">{message.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{message.subject}</p>
                  </TableCell>
                  <TableCell className="text-sm">{message.phone || '-'}</TableCell>
                  <TableCell className="text-sm">{message.isReplied ? '✅' : "❌"}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setSelectedMessage(message)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Message Details</DialogTitle>
                          </DialogHeader>
                          <MessageDetails message={message} />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(message.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredMessages.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No messages found matching your search.' : 'No messages yet.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMessages;
