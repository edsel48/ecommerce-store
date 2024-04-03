import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { X, Minus, Plus } from 'lucide-react';

import IconButton from '@/components/ui/icon-button';
import Currency from '@/components/ui/currency';
import useCart from '@/hooks/use-cart';
import { Product, Size } from '@/types';

interface CartItems {
  product: Product;
  quantity: number;
}

interface CartItemProps {
  data: CartItems;
}

interface MultiplierItemProps {
  data: Size;
  quantity: number;
}

const Multiplier: React.FC<MultiplierItemProps> = ({ data, quantity }) => {
  if (data.name === 'Piece') {
    return <></>;
  }

  return (
    <>
      <div>*</div>
      <div>{Number(data.value) * quantity} pcs </div>
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
            <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">
              {data.product.size.name}
            </p>
          </div>
          <div className="flex gap-3">
            <Currency
              value={
                Number(data.product.price) *
                (data.product.size.name == 'Piece' ? data.quantity : 1)
              }
            />
            <Multiplier data={data.product.size} quantity={data.quantity} />
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
