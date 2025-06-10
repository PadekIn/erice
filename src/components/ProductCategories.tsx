
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useCategories } from '@/hooks/useCategories';

const ProductCategories = () => {
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data?.slice(0, 2) || [];

  return (
    <section className="py-12 bg-earth-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-forest-800 mb-4">
            Kategori Produk
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pilih dari koleksi beras berkualitas tinggi kami, dipilih khusus untuk memenuhi kebutuhan dapur Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {categories.map((category, _) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="group"
            >
              <Card className="h-full overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group-hover:scale-103">
                <div className="relative">
                  <div
                    className="h-64 bg-cover bg-center transition-transform duration-300 "
                    style={{ backgroundImage: `url(${category.cover})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.productCount} products available</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-muted-foreground text-center">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;
