
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
import { Search, Eye, Mail } from 'lucide-react';
import { useContactMessages } from '@/hooks/useContact';
import { ContactMessage } from '@/services/contactService';
import MessageReplyForm from '@/components/admin/MessageReplyForm';

const AdminMessages = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: messagesResponse, isLoading, error } = useContactMessages();
  const messages = messagesResponse?.data || [];

  const filteredMessages = messages.filter(message => {
    const matchesSearch =
      message.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleReplySuccess = () => {
    setIsDialogOpen(false);
    setSelectedMessage(null);
  };

  const MessageDetails = ({ message }: { message: ContactMessage }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium text-forest-800 mb-2">From</h3>
          <p className="text-sm">{message.fullname} <span className="text-sm text-gray-500">{"<" + message.email + ">"}</span></p>
          {message.phone && <p className="text-sm text-gray-500">{message.phone}</p>}
        </div>
        <div>
          <h3 className="font-medium text-forest-800 mb-2">Subject</h3>
          <p className="text-sm">{message.subject}</p>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-forest-800 mb-2">Message</h3>
        <div className="text-sm text-gray-600  p-4 rounded-lg border">
          {message.message}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-forest-800 mb-2">Reply</h3>
        <MessageReplyForm message={message} onReplySuccess={handleReplySuccess} />
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
                <TableHead>Reply Status</TableHead>
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
                  <TableCell className="text-sm">
                    {message.isReplied ? (
                      <span className="text-green-600 font-medium">✅</span>
                    ) : (
                      <span className="text-orange-600 font-medium">❌</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog open={isDialogOpen && selectedMessage?.id === message.id} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) setSelectedMessage(null);
                      }}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setSelectedMessage(message);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Message Details</DialogTitle>
                          </DialogHeader>
                          {selectedMessage && <MessageDetails message={selectedMessage} />}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredMessages.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
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
