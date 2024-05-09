'use client';

import { Product, SizeOnProduct } from '@/types';
import Currency from '@/components/ui/currency';
import { ShoppingCart, X, Minus, Plus } from 'lucide-react';
import Button from './ui/button';
import Badge from './ui/badge';
import { sortPrices } from '@/lib/utils';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useCart from '@/hooks/use-cart';

import IconButton from '@/components/ui/icon-button';

interface InfoProps {
  data: Product;
  type: string;
  isPromo?: boolean;
}

export interface Prices {
  [key: string]: number;
}

const getPrice = (data: Product, type: string) => {
  const maxPrice = sortPrices(data.sizes);

  let prices: Prices = {
    normal: maxPrice[0].price,
    silver: maxPrice[0].priceSilver,
    gold: maxPrice[0].priceGold,
    platinum: maxPrice[0].pricePlatinum,
  };
  let price = prices['normal'];

  if (type != null && type != '') price = prices[type];

  return price;
};

export const AddMoreContext: React.FC<InfoProps> = ({
  data,
  type,
  isPromo = false,
}) => {
  const maxValueOnSizes = Math.max(...data?.sizes?.map((d) => +d.size.value));
  const maxPrice = sortPrices(data.sizes);

  if (maxPrice.length > 1) {
    let price = Number(maxPrice[maxPrice.length - 1].price);

    if (isPromo) {
      return (
        <>
          ~{' '}
          <Currency value={price * (1 - (data.promo?.discount || 0) * 0.01)} />
        </>
      );
    }

    return (
      <>
        ~ <Currency value={price} />
      </>
    );
  }

  return <></>;
};

const Info: React.FC<InfoProps> = ({ data, type }) => {
  const [size, setSize] = useState<SizeOnProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const cart = useCart();

  const addToCart = () => {
    if (size == null) return toast.error('Please pick a size!');
    if (quantity == 0) return toast.error('Please set the quantity!');

    cart.addItem(data, size, quantity);
  };

  const decreaseQuantity = () => {
    setQuantity(quantity - 1 < 1 ? quantity : quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div>
      <div className="flex gap-3">
        <h1 className="text-3xl font-bold text-gray-900"> {data.name} </h1>
        {data.promo != null && (
          <Badge
            data={{
              label: 'PROMO',
            }}
          />
        )}
      </div>
      <div className="mt-3 flex items-end justify-between">
        <p className="flex gap-3 text-2xl text-gray-900">
          {size == null ? (
            data.promo == null ? (
              <>
                <Currency value={getPrice(data, type)} />
                <AddMoreContext data={data} type={type} />
              </>
            ) : (
              <>
                <div className="flex">
                  <Currency
                    value={
                      getPrice(data, type) * (1 - data.promo.discount * 0.01)
                    }
                  />

                  <AddMoreContext
                    data={data}
                    type={type == null ? 'normal' : type}
                    isPromo={true}
                  />
                </div>
              </>
            )
          ) : data.promo == null ? (
            <Currency value={size.price * quantity} />
          ) : (
            <div className="flex flex-col">
              <div className="line-through">
                <Currency value={size.price * quantity} />
              </div>
              <Currency
                value={size.price * (1 - data.promo.discount * 0.01) * quantity}
              />
            </div>
          )}
        </p>
      </div>
      <hr className="my-4" />
      <div className="flex items-center gap-3">
        <h3 className="font-semibold text-black">Quantity </h3>
        <IconButton onClick={decreaseQuantity} icon={<Minus size={15} />} />
        <div className="qty">{quantity}</div>
        <IconButton onClick={increaseQuantity} icon={<Plus size={15} />} />
      </div>
      <div>
        <h3 className="font-semibold text-black">Description </h3>
        <textarea readOnly className="w-full resize-none">
          {data.description}
        </textarea>
      </div>
      <div className="flex items-center gap-x-4">
        <h3 className="font-semibold text-black">Size: </h3>
        <div className="flex gap-x-4">
          {data?.sizes?.map((d) => (
            <Button
              key={d.sizeId}
              className={
                size != null && size.id == d.id
                  ? 'mt-6 w-full border-solid border-white bg-black text-white'
                  : 'mt-6 w-full border-solid border-black bg-white text-black'
              }
              onClick={() => {
                setSize(d);
              }}
            >
              {d.size.name}
            </Button>
          ))}
        </div>
      </div>
      <div className="mt-10 flex items-center gap-x-3">
        <Button className="flex items-center gap-x-2" onClick={addToCart}>
          Add To Cart
          <ShoppingCart />
        </Button>
      </div>
    </div>
  );
};

export default Info;
