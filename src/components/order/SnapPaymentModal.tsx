
import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { X } from 'lucide-react';

interface SnapPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  snapUrl: string;
  onSuccess: () => void;
  onCancel?: (orderId: string) => void;
  orderId?: string;
}

const SnapPaymentModal = ({ isOpen, onClose, snapUrl, onSuccess, onCancel, orderId }: SnapPaymentModalProps) => {
  useEffect(() => {
    if (isOpen && snapUrl) {
      // Listen for payment completion messages from iframe
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) {
          // For Midtrans, we need to check for specific payment completion events
          if (event.data && typeof event.data === 'string') {
            if (event.data.includes('payment_success') || event.data.includes('success')) {
              onSuccess();
            }
          }
        }
      };

      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, [isOpen, snapUrl, onSuccess]);

  if (!snapUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-forest-800">Pembayaran</DialogTitle>
            {onCancel && orderId && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <X className="h-4 w-4 mr-1" />
                    Batalkan Pesanan
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Batalkan Pesanan</AlertDialogTitle>
                    <AlertDialogDescription>
                      Apakah Anda yakin ingin membatalkan pesanan ini?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => {
                        onCancel(orderId);
                        onClose();
                      }}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Ya, Batalkan
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </DialogHeader>
        
        <div className="p-4 pt-0">
          <div className="border rounded-lg overflow-auto">
            <iframe
              src={snapUrl}
              width="100%"
              height="525"
              frameBorder="0"
              title="Snap Payment"
              className="w-full"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SnapPaymentModal;
