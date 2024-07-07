import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { X, Minus, Plus } from 'lucide-react';

import IconButton from '@/components/ui/icon-button';
import Currency from '@/components/ui/currency';
import useCart from '@/hooks/use-cart';
import Button from '@/components/ui/button';

import axios from 'axios';

import { useEffect, useState } from 'react';

import { Product, Size, SizeOnProduct } from '@/types';
import { isWithinInterval } from 'date-fns';

interface CartItems {
  product: Product;
  productSize: SizeOnProduct;
  size: number;
  quantity: number;
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

  let [user, setUser] = useState();
  let [loading, setLoading] = useState(false);

  let [price, setPrice] = useState<number>(0);

  useEffect(() => {
    setLoading(true);

    const fetchUser = async () => {
      let response = await axios.get('/api/user');

      let user = response.data;

      let tier = {
        SILVER: data.productSize.priceSilver,
        GOLD: data.productSize.priceGold,
        PLATINUM: data.productSize.pricePlatinum,
      };

      // @ts-ignore
      setPrice(tier[user.tier]);
      setUser(response.data);
      setLoading(false);
    };

    fetchUser();
  }, []);

  const onRemove = () => {
    cart.removeItem(data.product.id, data.productSize);
  };

  const decreaseQuantity = () => {
    cart.removeQuantity(data.product.id, data.productSize);
  };

  const increaseQuantity = () => {
    cart.addQuantity(data.product.id, data.productSize);
  };

  if (loading) return <></>;

  if (!loading) {
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
              {data.product.promo == null ? (
                <div className="flex gap-3">
                  <Currency value={Number(price)} />
                  {data.quantity != 1 && <div>{`* ${data.quantity}`}</div>}
                </div>
              ) : isWithinInterval(new Date(), {
                  // @ts-ignore
                  start: data.product.promo.startAt,
                  // @ts-ignore
                  end: data.product.promo.endAt,
                }) ? (
                data.product.promo.minimumBought <= data.quantity ? (
                  <Currency
                    value={Number(
                      price *
                        (1 - data.product.promo.discount * 0.01) *
                        data.quantity,
                    )}
                  />
                ) : (
                  <div className="flex gap-3">
                    <Currency value={Number(price)} />
                    {data.quantity != 1 && <div>{`* ${data.quantity}`}</div>}
                  </div>
                )
              ) : (
                <div className="flex gap-3">
                  <Currency value={Number(price)} />
                  {data.quantity != 1 && <div>{`* ${data.quantity}`}</div>}
                </div>
              )}
              <div>
                {data.product.promo == null ? (
                  <Currency value={Number(price * data.quantity)} />
                ) : isWithinInterval(new Date(), {
                    // @ts-ignore
                    start: data.product.promo.startAt,
                    // @ts-ignore
                    end: data.product.promo.endAt,
                  }) ? (
                  data.product.promo.minimumBought <= data.quantity ? (
                    <Currency
                      value={Number(
                        price *
                          (1 - data.product.promo.discount * 0.01) *
                          data.quantity,
                      )}
                    />
                  ) : (
                    <Currency value={Number(price * data.quantity)} />
                  )
                ) : (
                  <Currency value={Number(price * data.quantity)} />
                )}
              </div>
              <div>{data.productSize.size.name}</div>
            </div>
          </div>
        </div>
      </li>
    );
  }
};

export default CartItem;
