
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { useReviews } from '@/hooks/useApi';

const Testimonials = () => {
  const { data: reviewsResponse, isLoading } = useReviews();
  const reviews = reviewsResponse?.data?.slice(0, 3) || []; // Show only first 3 reviews

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-5 w-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-forest-800 mb-4">
              Testimoni Pelanggan
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Dengarkan pengalaman pelanggan dan mitra petani kami
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-full animate-pulse">
                <CardContent className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-forest-800 mb-4">
            Testimoni Pelanggan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dengarkan pengalaman pelanggan dan mitra petani kami
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review: any, index: number) => (
            <Card key={review.id} className="h-full hover:shadow-lg transition-shadow duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-1">
                  {renderStars(review.rating)}
                </div>
                <blockquote className="text-muted-foreground italic">
                  "{review.comment}"
                </blockquote>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>
                      {review.User?.fullname?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-forest-800">{review.User?.fullname || 'Anonymous'}</p>
                    <p className="text-sm text-muted-foreground">Pelanggan - {review.Product?.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {reviews.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Belum ada testimoni tersedia.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
