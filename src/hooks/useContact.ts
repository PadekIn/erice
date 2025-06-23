
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ContactService, SendContactRequest, ReplyContactRequest } from '@/services/contactService';

export const useContactMessages = () => {
  return useQuery({
    queryKey: ['contactMessages'],
    queryFn: () => ContactService.getMessages(),
  });
};

export const useSendContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactData: SendContactRequest) =>
      ContactService.sendMessage(contactData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactMessages'] });
    },
  });
};

export const useReplyToMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId, replyData }: { messageId: string; replyData: ReplyContactRequest }) =>
      ContactService.replyToMessage(messageId, replyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactMessages'] });
    },
  });
};
