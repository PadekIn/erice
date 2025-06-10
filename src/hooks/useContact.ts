
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ContactService, SendContactRequest } from '@/services/contactService';

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
