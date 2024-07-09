'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Button from '@/components/ui/button';
import Currency from '@/components/ui/currency';
import useCart from '@/hooks/use-cart';
import { toast } from 'react-hot-toast';
import Dropdown from '@/components/ui/dropdown';
import { formatter } from '@/lib/utils';

const Summary = () => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);

  const [ongkir, setOngkir] = useState(null);

  const [user, setUser] = useState({});

  const [total, setTotal] = useState(0);

  const [cityData, setCityData] = useState([]);

  const [address, setAddress] = useState('');

  useEffect(() => {
    const link = `https://app.sandbox.midtrans.com/snap/snap.js`;
    const clientKey: string = process.env.NEXT_PUBLIC_CLIENT || '';
    const script = document.createElement('script');
    script.src = link;
    script.setAttribute('data-client-key', clientKey);
    script.async = true;

    document.body.appendChild(script);

    const fetch = async () => {
      try {
        let cityResponse = await axios.get('/api/ongkir/city');
        let city = cityResponse.data;

        let cityFormatted: {
          id: number;
          name: string;
        }[] = [];

        // @ts-ignore
        city.rajaongkir.results.forEach((e) => {
          cityFormatted.push({
            id: e.city_id,
            name: e.city_name,
          });
        });

        let response = await axios.get('/api/user');
        let user = response.data;

        setUser(user);

        // @ts-ignore
        setCityData(cityFormatted);
      } catch (e) {
        //@ts-ignore
        console.log(e);
      }
    };

    fetch();
  }, []);

  const getTotal = (): {
    total: number;
    discount: number;
  } => {
    if (user == null) return { total: 0, discount: 0 };
    let discount = 0;

    // @ts-ignore
    let promos = [];
    let promoDict = {};

    console.log({
      // @ts-ignore
      tier: user.tier,
    });

    let total = items.reduce((total, item) => {
      let tier = {
        SILVER: item.productSize.priceSilver,
        GOLD: item.productSize.priceGold,
        PLATINUM: item.productSize.pricePlatinum,
      };

      // @ts-ignore
      let price = Number(tier[user.tier]);
      let discountNow = 0;

      let data = {
        promo: item.product.promo,
        discountNow:
          // @ts-ignore
          price * item.quantity * (Number(item.product.promo.discount) * 0.01),
        // @ts-ignore
        promoMax: Number(item.product.promo.maximumDiscountAmount),
        excedeMaxPromo:
          // @ts-ignore
          price * item.quantity * (Number(item.product.promo.discount) * 0.01) >
          // @ts-ignore
          Number(item.product.promo.maximumDiscountAmount),
        logicIfExcede:
          price *
            item.quantity *
            // @ts-ignore
            (Number(item.product.promo.discount) * 0.01) <=
          // @ts-ignore
          Number(item.product.promo.maximumDiscountAmount)
            ? price *
              item.quantity *
              // @ts-ignore
              (Number(item.product.promo.discount) * 0.01)
            : // @ts-ignore
              Number(item.product.promo.maximumDiscountAmount),
        price:
          price * item.quantity -
          (discountNow >
          // @ts-ignore
          (Number(item.product.promo.maximumDiscountAmount) || 9999999999)
            ? // @ts-ignore
              Number(item.product.promo.maximumDiscountAmount)
            : discountNow),
        product: item.product,
        size: item.productSize,
        trueCount: Number(item.productSize.size.value) * Number(item.quantity),
        // @ts-ignore
        discount:
          discountNow >
          // @ts-ignore
          (Number(item.product.promo.maximumDiscountAmount) || 9999999999)
            ? // @ts-ignore
              Number(item.product.promo.maximumDiscountAmount)
            : discountNow,
        priceAfterDiscount:
          price * item.quantity -
          (price *
            item.quantity *
            // @ts-ignore
            (Number(item.product.promo.discount) * 0.01) <=
          // @ts-ignore
          Number(item.product.promo.maximumDiscountAmount)
            ? price *
              item.quantity *
              // @ts-ignore
              (Number(item.product.promo.discount) * 0.01)
            : // @ts-ignore
              Number(item.product.promo.maximumDiscountAmount)),
      };

      console.log(data);

      if (item.product.promo != null) {
        if (
          // @ts-ignore
          Number(item.product.promo.maximalUseCount) >
          // @ts-ignore
          Number(item.product.promo.useCount)
        ) {
          // @ts-ignore
          if (data.trueCount >= item.product.promo.minimumAmountBought) {
            // @ts-ignore
            promos.push({
              promo: item.product.promo,
              discount: data.logicIfExcede,
              id: item.product.id,
            });

            // @ts-ignore
            promoDict[item.product.id + item.productSize.id] =
              data.logicIfExcede;

            discountNow = data.discountNow;

            price = data.price;

            discount += data.logicIfExcede;
          }
        }
      }

      return total + price;
    }, 0);

    // @ts-ignore
    let totalDiscount = promos.reduce((total, b) => total + b.discount, 0);

    return {
      total,
      discount,
      // @ts-ignore
      grandTotal: total - totalDiscount,
      totalDiscount,
      // @ts-ignore
      promos,
      promoDict,
    };
  };

  const onCheckout = async () => {
    // @ts-ignore

    if (items.length == 0) {
      toast.error('Cart is Empty');
    } else {
      // @ts-ignore
      let { total, discount, totalDiscount, promos, promoDict, grandTotal } =
        getTotal();

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
        {
          productIds: items.map((item) => item.product.id),
          carts: items.map((e) => {
            return {
              ...e,
              discount: promoDict[e.product.id + e.productSize.id],
            };
          }),
          total: total + ongkirPrice,
          ongkir: ongkirPrice,
          totalDiscount,
          // @ts-ignore
          memberId: user.id,
          address,
        },
      );

      //@ts-ignore
      window.snap.pay(response.data.token);
    }
  };

  const [city, setCity] = useState(cityData[0]);

  const [ongkirData, setOngkirData] = useState([]);
  const [ongkirPrice, setOngkirPrice] = useState(0);
  const [unformattedOngkir, setUnformattedOngkir] = useState([]);

  const fetchOngkir = async () => {
    let total = 0;

    items.forEach((e) => {
      total += e.productSize.weight;
    });

    if (city != null) {
      let response = await axios.post('/api/ongkir', {
        // @ts-ignore
        destination: city.id,
        weight: total,
      });

      let responseData = response.data.rajaongkir.results[0].costs;
      setUnformattedOngkir(responseData);

      let formattedOngkirData: {
        id: number;
        name: string;
      }[] = [];

      // @ts-ignore
      responseData.forEach((e, i) => {
        formattedOngkirData.push({
          id: i,
          name: `${e.service} - ${formatter.format(Number(e.cost[0].value))}`,
        });
      });

      // @ts-ignore
      setOngkirData(formattedOngkirData);
      // @ts-ignore
      setOngkir(formattedOngkirData[0]);
      setOngkirPrice(responseData[0].cost[0].value);
    }
  };

  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <div className="flex-col gap-5">
        <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
        <div className="flex-col gap-3">
          <h2 className="text-lg font-medium text-gray-900">Shipping Info</h2>
          <div className="flex-col gap-5">
            <div className="mb-3 font-bold">City to Send</div>
            <div className="mb-3">
              {/* @ts-ignore */}
              <Dropdown data={cityData} setSelected={setCity} selected={city} />
              <div className="mt-3">
                <div className="mb-3 font-bold">Address</div>
                <input
                  type="text"
                  className="w-full px-5 py-3"
                  onBlur={(e) => {
                    // @ts-ignore
                    setAddress(`${e.currentTarget.value}, ${city.name}`);
                  }}
                />
              </div>
            </div>
            <div className="mb-3">
              {/* @ts-ignore */}
              {ongkir != null ? (
                <Dropdown
                  data={ongkirData}
                  // @ts-ignore
                  setSelected={(e) => {
                    // @ts-ignore
                    setOngkir(e);

                    // @ts-ignore
                    setOngkirPrice(unformattedOngkir[e.id].cost[0].value);
                  }}
                  selected={ongkir}
                />
              ) : (
                <></>
              )}
            </div>
            <Button
              onClick={async () => {
                await fetchOngkir();
              }}
              className="mt-3 w-full"
            >
              {' '}
              Check Shipping Cost{' '}
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Order total</div>
          <Currency value={getTotal().total} />
        </div>
        <div className="flex items-center justify-between ">
          <div className="text-base font-medium text-gray-900">
            Shipping Cost
          </div>
          <Currency value={ongkirPrice} />
        </div>
        {/* @ts-ignore */}
        {getTotal().promos.map((e) => {
          return (
            <div className="flex items-center justify-between ">
              <div className="text-base font-medium text-gray-900">
                {/* @ts-ignore */}
                Promo [{e.promo.name}]
              </div>
              <div className="flex">
                <div> - </div>
                {/* @ts-ignore */}
                <Currency value={e.discount} />
              </div>
            </div>
          );
        })}
        <div className="flex items-center justify-between ">
          <div className="text-base font-medium text-gray-900">Grand Total</div>
          {/* @ts-ignore */}
          <Currency value={ongkirPrice + getTotal().grandTotal} />
        </div>
      </div>
      <Button
        onClick={onCheckout}
        disabled={items.length === 0}
        className="mt-6 w-full"
      >
        Checkout
      </Button>
    </div>
  );
};

export default Summary;
