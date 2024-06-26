import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';

import IconButton from '@/components/ui/icon-button';
import Currency from '@/components/ui/currency';
import useCart from '@/hooks/use-cart';
import { Product, SizeOnProduct } from '@/types';

interface CartItems {
  product: Product;
  productSize: SizeOnProduct;
  size: number;
  quantity: number;
}

interface CartItemProps {
  data: CartItems;
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {
  const cart = useCart();

  const onRemove = () => {
    cart.removeItem(data.product.id, data.productSize);
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
          <div className="flex justify-between">
            <p className=" text-lg font-semibold text-black">
              {data.product.name}
            </p>
          </div>

          <div className="mt-1 flex text-sm">
            <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">
              {data.product.sizes.map((e) => e.id)}
            </p>
          </div>
          <Currency value={data.product.sizes[0].price} />
        </div>
      </div>
    </li>
  );
};

export default CartItem;
