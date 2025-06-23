
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useReplyToMessage } from '@/hooks/useContact';
import { ContactMessage } from '@/services/contactService';

interface MessageReplyFormProps {
  message: ContactMessage;
  onReplySuccess?: () => void;
}

const MessageReplyForm = ({ message, onReplySuccess }: MessageReplyFormProps) => {
  const [replyText, setReplyText] = useState(message.replyMessage || '');
  const { toast } = useToast();
  const replyMutation = useReplyToMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!replyText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reply message",
        variant: "destructive",
      });
      return;
    }

    try {
      await replyMutation.mutateAsync({
        messageId: message.id,
        replyData: { replyMessage: replyText.trim() }
      });

      toast({
        title: "Success",
        description: "Reply sent successfully",
      });

      onReplySuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive",
      });
    }
  };

  const isReadOnly = message.isReplied;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Textarea
          id="reply"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder={isReadOnly ? 'No reply sent yet' : 'Type your reply here...'}
          className="mt-1 bg-rice-50"
          rows={4}
          readOnly={isReadOnly}
          disabled={isReadOnly}
        />
      </div>
      
      {!isReadOnly && (
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={replyMutation.isPending || !replyText.trim()}
            className="bg-forest-600 hover:bg-forest-700"
          >
            {replyMutation.isPending ? 'Sending...' : 'Send Reply'}
          </Button>
        </div>
      )}
    </form>
  );
};

export default MessageReplyForm;
