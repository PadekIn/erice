/* eslint-disable @typescript-eslint/no-explicit-any */

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { useReviews, useReviewsRecap } from '@/hooks/useApi';

const TestimonialsPage = () => {
  const { data: reviewsResponse, isLoading: reviewsLoading } = useReviews();
  const { data: recapResponse, isLoading: recapLoading } = useReviewsRecap();

  const reviews = reviewsResponse?.data || [];
  const recapData = recapResponse?.data?.[0] || {};

  const stats = [
    { label: 'Total Testimoni', value: `${recapData.userReviewCount || 0}+` },
    { label: 'Rating Rata-rata', value: `${recapData.ratingRate || 0}/5` },
    { label: 'Pelanggan Puas', value: `${recapData.userSatisfied || 0}%` },
    { label: 'Repeat Order', value: `${recapData.repeatOrder || 0}%` }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  if (reviewsLoading || recapLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-forest-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-forest-800 mb-4">
            Testimoni Pelanggan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dengarkan pengalaman nyata dari pelanggan yang telah mempercayai kualitas beras Indragiri Hilir
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6">
                <div className="text-2xl md:text-3xl font-bold text-forest-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review: any, index: number) => (
            <Card key={review.id} className="h-full hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6 space-y-4">
                {/* Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {renderStars(review.rating)}
                  </div>
                </div>

                {/* Content */}
                <blockquote className="text-muted-foreground italic">
                  "{review.comment}"
                </blockquote>

                {/* Product */}
                <div className="text-center">
                  <div className="text-xs text-forest-600 bg-forest-50 px-2 py-1 rounded-full inline-block">
                    Produk: {review.Product?.name}
                  </div>
                </div>

                {/* User Info */}
                <div className="flex items-center space-x-3 pt-4 border-t">
                  <Avatar>
                    <AvatarFallback>
                      {review.User?.fullname?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-forest-800">{review.User?.fullname || 'Anonymous'}</p>
                    <p className="text-sm text-muted-foreground">Pelanggan</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {reviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Belum ada testimoni tersedia.</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12 p-8 bg-gradient-to-r from-forest-50 to-earth-50 rounded-2xl">
          <h2 className="text-2xl font-bold text-forest-800 mb-4">
            Bergabunglah dengan Ribuan Pelanggan Puas
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Rasakan sendiri kualitas beras premium Indragiri Hilir dan bergabunglah 
            dengan komunitas yang peduli kesehatan dan mendukung petani lokal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/products" className="inline-block">
              <button className="bg-forest-600 hover:bg-forest-700 text-white px-8 py-3 rounded-full font-semibold transition-colors">
                Mulai Berbelanja
              </button>
            </a>
            <a href="/contact" className="inline-block">
              <button className="border border-forest-600 text-forest-600 hover:bg-forest-600 hover:text-white px-8 py-3 rounded-full font-semibold transition-colors">
                Hubungi Kami
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestimonialsPage;
