'use client';

import getProduct from '@/actions/get-product';
import getProducts from '@/actions/get-products';
import Gallery from '@/components/gallery';
import Info from '@/components/info';
import ProductList from '@/components/product-list';
import Container from '@/components/ui/container';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ProductPageProps {
  params: {
    productId: string;
  };
}

const ProductPage: React.FC<ProductPageProps> = ({ params }) => {
  const router = useRouter();

  const [product, setProduct] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);

  useEffect(() => {
    router.refresh();
    const fetch = async () => {
      const product = await getProduct(params.productId);

      const suggestedProducts = await getProducts({
        categoryId: product?.category?.id,
      });
      // @ts-ignore
      setProduct(product);
      // @ts-ignore
      setSuggestedProducts(suggestedProducts);
    };

    fetch();
  });

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            {/* @ts-ignore */}
            <Gallery images={product.images} />
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              {/* @ts-ignore */}
              <Info data={product} type={'normal'} />
            </div>
          </div>
          <hr className="my-10" />
          <ProductList title="Related Items" items={suggestedProducts} />
        </div>
      </Container>
    </div>
  );
};

export default ProductPage;
