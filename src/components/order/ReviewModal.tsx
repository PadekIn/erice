
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  mode?: 'create' | 'view';
}

const ReviewModal = ({ isOpen, onClose, order, mode = 'create' }: ReviewModalProps) => {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get existing review data for view mode
  const existingReview = mode === 'view' && order?.items?.find((item: any) => item.rating !== null);

  const handleStarClick = (value: number) => {
    if (mode === 'create') {
      setRating(value);
    }
  };

  const handleSubmitReview = async () => {
    if (mode === 'view') return;

    if (rating === 0) {
      toast({
        title: "Rating Diperlukan",
        description: "Silakan berikan rating untuk produk",
        className: "bg-yellow-50 border-yellow-200 text-yellow-800",
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: "Komentar Diperlukan",
        description: "Silakan berikan komentar untuk produk",
        className: "bg-yellow-50 border-yellow-200 text-yellow-800",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Extract product IDs from order items
      const productId = order?.items?.map((item: any) => item.productId) || [];

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating,
          comment,
          productId
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Ulasan Berhasil Dikirim",
          description: "Terima kasih atas ulasan Anda",
          className: "bg-green-50 border-green-200 text-green-800",
        });
        onClose();
        setRating(0);
        setComment('');
      } else {
        // Create error object with proper structure for error handling
        const errorMessage = data.errors && data.errors.length > 0
          ? data.errors.map((err: any) => err.message || err).join(', ')
          : data.message || `HTTP error! status: ${response.status}`;

        const error = new Error(errorMessage);
        (error as any).response = { data };
        (error as any).errors = data.errors;
        throw error;
      }
    } catch (error: any) {
      toast({
        title: "Gagal Mengirim Ulasan",
        description: error.message || "Terjadi kesalahan saat mengirim ulasan",
        className: "bg-red-50 border-red-200 text-red-800",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const displayRating = mode === 'view' ? existingReview?.rating || 0 : rating;
  const displayComment = mode === 'view' ? existingReview?.comment || '' : comment;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-forest-800">
            {mode === 'view' ? 'Lihat Ulasan Produk' : 'Beri Ulasan Produk'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Info */}
          <div className="border-b pb-4">
            <h3 className="font-medium text-forest-800 mb-2">Pesanan #{order?.orderNumber}</h3>
            <p className="text-sm text-muted-foreground">
              Total: {formatPrice(order?.total || 0)}
            </p>
          </div>

          {/* Products */}
          {order?.OrderItems && (
            <div className="space-y-3">
              <h4 className="font-medium text-forest-800">Produk yang Dibeli:</h4>
              <div className="space-y-2">
                {order.OrderItems.map((item: any, index: number) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-rice-50 rounded-lg">
                    <div
                      className="w-12 h-12 bg-cover bg-center rounded flex-shrink-0"
                      style={{ backgroundImage: `url(${item.Product.image})` }}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.Product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rating */}
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleStarClick(value)}
                  className={`p-1 transition-transform ${mode === 'create' ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
                  disabled={mode === 'view'}
                >
                  <Star
                    className={`h-8 w-8 ${value <= displayRating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                      }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Komentar</Label>
            <Textarea
              id="comment"
              value={mode === 'view' ? displayComment : comment}
              onChange={(e) => mode === 'create' && setComment(e.target.value)}
              placeholder={mode === 'view' ? 'Tidak ada komentar' : 'Bagikan pengalaman Anda dengan produk ini...'}
              rows={4}
              readOnly={mode === 'view'}
              className={mode === 'view' ? 'bg-gray-50' : ''}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              {mode === 'view' ? 'Tutup' : 'Batal'}
            </Button>
            {mode === 'create' && (
              <Button
                onClick={handleSubmitReview}
                disabled={isSubmitting || rating === 0}
                className="bg-forest-600 hover:bg-forest-700"
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
