import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { X, Minus, Plus } from 'lucide-react';

import IconButton from '@/components/ui/icon-button';
import Currency from '@/components/ui/currency';
import useCart from '@/hooks/use-cart';
import Button from '@/components/ui/button';

import { useState } from 'react';

import { Product, Size } from '@/types';

interface CartItems {
  product: Product;
  quantity: number;
  size: number;
}

interface CartItemProps {
  data: CartItems;
}

interface MultiplierItemProps {
  data: number;
  quantity: number;
}

const Multiplier: React.FC<MultiplierItemProps> = ({ data, quantity }) => {
  if (data === 1) {
    return <></>;
  }

  return (
    <>
      <div>*</div>
      <div>
        {Number(data)} * {quantity} = {Number(data) * quantity} pcs
      </div>
    </>
  );
};

const CartItem: React.FC<CartItemProps> = ({ data }) => {
  const cart = useCart();

  const onRemove = () => {
    cart.removeItem(data.product.id);
  };

  const decreaseQuantity = () => {
    cart.removeQuantity(data.product.id);
  };

  const increaseQuantity = () => {
    cart.addQuantity(data.product.id);
  };

  const onChangeButton = (value: number, productId: string) => {
    cart.changeSize(data.product.id, value);
  };

  return (
    <li className="flex border-b py-6">
      <div className="relative h-24 w-24 overflow-hidden rounded-md sm:h-48 sm:w-48">
        <Image
          fill
          src={data.product.images[0].url}
          alt=""
          className="object-cover object-center"
        />
      </div>
      <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="absolute right-0 top-0 z-10">
          <IconButton onClick={onRemove} icon={<X size={15} />} />
        </div>
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div className="flex flex-col justify-around">
            <p className=" text-lg font-semibold text-black">
              {data.product.name}
            </p>
          </div>
          <div className="mt-1 flex text-sm">
            <div className="flex items-center justify-center gap-5">
              <IconButton
                onClick={decreaseQuantity}
                icon={<Minus size={15} />}
              />
              <div className="qty">{data.quantity}</div>
              <IconButton
                onClick={increaseQuantity}
                icon={<Plus size={15} />}
              />
            </div>
            <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500"></p>
          </div>
          <div className="flex w-full flex-col gap-3">
            <div>
              <Currency
                value={
                  Number(data.product.price) * (data.size == 1 ? data.size : 1)
                }
              />{' '}
              <Multiplier data={data.size} quantity={data.quantity} />
            </div>
            <div className="flex gap-3">
              {data.product.sizes.map((s) =>
                +data.size !== +s.size.value ? (
                  <Button
                    key={s.sizeId}
                    className="mt-6 w-full border bg-white text-black"
                    onClick={() => {
                      onChangeButton(+s.size.value, data.product.id);
                    }}
                  >
                    {s.size.name}
                  </Button>
                ) : (
                  <Button
                    key={s.sizeId}
                    className="border-1 mt-6 w-full border border-black bg-white text-black"
                    onClick={() => {
                      onChangeButton(+s.size.value, data.product.id);
                    }}
                  >
                    {s.size.name}
                  </Button>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
