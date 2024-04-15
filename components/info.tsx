import { Product } from '@/types';
import Currency from '@/components/ui/currency';
import { ShoppingCart } from 'lucide-react';
import Button from './ui/button';

interface InfoProps {
  data: Product;
  type: string;
}

export interface Prices {
  [key: string]: string
}

const getPrice = (data: Product, type: string) => {
  let prices : Prices = {
    normal: data.price,
    silver: data.priceSilver,
    gold: data.priceGold,
    platinum: data.pricePlatinum,
  };
  let price = prices['normal'];

  if (type != null) price = prices[type];

  return price;
};

export const AddMoreContext: React.FC<InfoProps> = ({ data, type }) => {
  const maxValueOnSizes = Math.max(...data?.sizes?.map((d) => +d.size.value));

  if (data?.sizes?.length > 1) {
    return (
      <>
        ~ <Currency value={Number(getPrice(data, type)) * maxValueOnSizes} />
      </>
    );
  }

  return <></>;
};

const Info: React.FC<InfoProps> = ({ data, type }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900"> {data.name} </h1>
      <div className="mt-3 flex items-end justify-between">
        <p className="flex gap-3 text-2xl text-gray-900">
          <Currency value={getPrice(data, type)} />{' '}
          <AddMoreContext data={data} type={type} />
        </p>
      </div>
      <hr className="my-4" />
      <div className="flex items-center gap-x-4">
        <h3 className="font-semibold text-black">Size: </h3>
        <div>{data?.sizes?.map((d) => d.size.name).join(', ')}</div>
      </div>
      <div className="mt-10 flex items-center gap-x-3">
        <Button className="flex items-center gap-x-2">
          Add To Card
          <ShoppingCart />
        </Button>
      </div>
    </div>
  );
};

export default Info;
