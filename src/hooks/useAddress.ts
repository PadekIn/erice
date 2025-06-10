
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AddressService, AddAddressRequest } from '@/services/addressService';

export const useUserAddresses = () => {
  return useQuery({
    queryKey: ['userAddresses'],
    queryFn: () => AddressService.getUserAddresses(),
  });
};

export const useAddAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressData: AddAddressRequest) =>
      AddressService.addAddress(addressData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userAddresses'] });
    },
  });
};
