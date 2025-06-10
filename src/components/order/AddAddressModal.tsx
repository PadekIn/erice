
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import { useAddAddress } from '@/hooks/useAddress';
import { useToast } from '@/hooks/use-toast';

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddAddressModal = ({ isOpen, onClose }: AddAddressModalProps) => {
  const { toast } = useToast();
  const addAddressMutation = useAddAddress();
  
  const [formData, setFormData] = useState({
    street: '',
    village: '',
    subDistrict: '',
    city: '',
    province: '',
    country: 'Indonesia',
    postalCode: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addAddressMutation.mutateAsync({
        ...formData,
        postalCode: Number(formData.postalCode)
      });
      
      toast({
        title: "Berhasil",
        description: "Alamat berhasil ditambahkan",
      });
      
      onClose();
      setFormData({
        street: '',
        village: '',
        subDistrict: '',
        city: '',
        province: '',
        country: 'Indonesia',
        postalCode: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menambahkan alamat",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tambah Alamat Pengiriman</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Alamat Lengkap *</Label>
            <Input
              id="address"
              value={formData.street}
              onChange={(e) => setFormData({...formData, street: e.target.value})}
              placeholder="Jalan, Nomor Rumah, RT/RW"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="village">Kelurahan/Desa *</Label>
              <Input
                id="village"
                value={formData.village}
                onChange={(e) => setFormData({...formData, village: e.target.value})}
                placeholder="Kelurahan atau Desa"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subDistrict">Kecamatan *</Label>
              <Input
                id="subDistrict"
                value={formData.subDistrict}
                onChange={(e) => setFormData({...formData, subDistrict: e.target.value})}
                placeholder="Kecamatan"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Kota/Kabupaten *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                placeholder="Kota atau Kabupaten"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="province">Provinsi *</Label>
              <Input
                id="province"
                value={formData.province}
                onChange={(e) => setFormData({...formData, province: e.target.value})}
                placeholder="Provinsi"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Negara *</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                placeholder="Negara"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Kode Pos *</Label>
              <Input
                id="postalCode"
                type="number"
                value={formData.postalCode}
                onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                placeholder="12345"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={addAddressMutation.isPending}
              className="bg-forest-600 hover:bg-forest-700"
            >
              {addAddressMutation.isPending ? 'Menyimpan...' : 'Simpan Alamat'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAddressModal;
