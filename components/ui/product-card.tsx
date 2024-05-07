'use client';

import Image from 'next/image';
import { MouseEventHandler } from 'react';
import { Expand, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';

import Currency from '@/components/ui/currency';
import IconButton from '@/components/ui/icon-button';
import usePreviewModal from '@/hooks/use-preview-modal';
import Badge from './badge';
import useCart from '@/hooks/use-cart';
import { Product } from '@/types';
import { AddMoreContext } from '../info';

import { useSearchParams } from 'next/navigation';
import { sortPrices } from '@/lib/utils';

interface ProductCard {
  data: Product;
}

const ProductCard: React.FC<ProductCard> = ({ data }) => {
  const previewModal = usePreviewModal();
  const cart = useCart();
  const params = useSearchParams();

  const router = useRouter();

  const handleClick = () => {
    router.push(`/product/${data?.id}`);
  };

  const onPreview: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();

    previewModal.onOpen(data);
  };

  let type: string | null = params.get('type');
  const maxPrice = sortPrices(data.sizes);

  let prices = {
    normal: maxPrice[0].price,
    silver: maxPrice[0].priceSilver,
    gold: maxPrice[0].priceGold,
    platinum: maxPrice[0].pricePlatinum,
  };
  let price = prices['normal'];

  // @ts-ignore
  if (type != null) price = prices[type];

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer space-y-4 rounded-xl border bg-white p-3"
    >
      {/* Image & actions */}
      <div className="relative aspect-square rounded-xl bg-gray-100">
        <Image
          src={data.images?.[0]?.url}
          alt=""
          fill
          className="aspect-square rounded-md object-cover"
        />
        <div className="absolute bottom-5 w-full px-6 opacity-0 transition group-hover:opacity-100">
          <div className="flex justify-center gap-x-6">
            <IconButton
              onClick={onPreview}
              icon={<Expand size={20} className="text-gray-600" />}
            />
          </div>
        </div>
      </div>
      {/* Description */}
      <div>
        <p className="text-lg font-semibold">{data.name}</p>
        <p className="text-sm text-gray-500">{data.category?.name}</p>
      </div>
      {/* Price & Reiew */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          {data.promo == null ? (
            <>
              <Currency value={price} />
              <AddMoreContext
                data={data}
                type={type == null ? 'normal' : type}
              />
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <div className="flex gap-2 line-through">
                  <Currency value={price} />
                  <AddMoreContext
                    data={data}
                    type={type == null ? 'normal' : type}
                  />
                </div>
                <Badge
                  data={{
                    label: `${data.promo.discount}%`,
                  }}
                />
              </div>

              <div className="flex gap-2">
                <div className="flex">
                  <Currency value={price * (1 - data.promo.discount * 0.01)} />
                </div>
                <AddMoreContext
                  data={data}
                  type={type == null ? 'normal' : type}
                  isPromo={true}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
