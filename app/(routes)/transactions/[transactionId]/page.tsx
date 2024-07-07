'use client';

import axios from 'axios';
import Container from '@/components/ui/container';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

const TransactionDetailPage = ({
  params,
}: {
  params: { transactionId: string };
}) => {
  const [transactions, setTransactions] = useState([]);
  const [transaction, setTransaction] = useState();

  useEffect(() => {
    const fetch = async () => {
      try {
        let response = await axios.get(`/api/transactions`);
        let { data } = response;

        setTransactions(data);
        setTransaction(
          // @ts-ignore
          data.filter((item) => item.id == params.transactionId)[0],
        );
      } catch (e) {
        console.error(e);
      }
    };

    fetch();
  }, []);

  if (transaction == null) {
    return (
      <div className="bg-white">
        <Container>
          <div className="px-4 py-10 sm:px-6 lg:px-8">
            Fetching Data please wait
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="mb-3 flex gap-2 text-lg font-semibold">
            Order <p className="font-bold">[{params.transactionId}]</p>
          </h1>
          {/* @ts-ignore */}
          <h2 className="mb-3 font-bold">Status : {transaction.status}</h2>

          <table className="text-surface w-full min-w-full table-auto rounded-md border border-black text-center text-sm">
            <thead className="border-b border-neutral-200 font-medium ">
              <tr className="">
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Size</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-right">Quantity</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4 text-right">Discount</th>
                <th className="px-6 py-4 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {/* @ts-ignore */}
              {transaction.orderItems.map((item) => {
                return (
                  <tr className="border-b border-neutral-200 transition duration-300 ease-in-out hover:bg-neutral-100 ">
                    <td className="whitespace-nowrap px-6 py-4 text-left">
                      {item.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4  text-left">
                      {item.size}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      {item.price}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      {item.quantity}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      {item.total}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      {item.discount}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      {item.subtotal}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-5 flex justify-around">
            <div className="flex-1"></div>
            <div className="flex-1 text-right">
              {/* @ts-ignore */}
              <h2 className="mb-3 font-bold">Subtotal : {transaction.total}</h2>
              <h2 className="mb-3 font-bold">
                {/* @ts-ignore */}
                Shipping Cost : {transaction.ongkir}
              </h2>
              <h2 className="mb-3 font-bold">
                {/* @ts-ignore */}
                Total Discount : {transaction.totalDiscount}
              </h2>
              <h2 className="mb-3 font-bold">
                {/* @ts-ignore */}
                Grand Total : {transaction.grandTotal}
              </h2>
            </div>
          </div>
          <hr className="mt-3 " />
          <div className="mt-3">
            <h1 className="mb-3 text-lg font-bold">
              {/* @ts-ignore */}
              Order Logs [{transaction.logs.length}]
            </h1>
            <div className="w-full flex-col gap-3">
              {/* @ts-ignore */}
              {transaction.logs.map((log) => {
                return (
                  <a
                    href="#"
                    className="mt-3 block w-full rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-100"
                  >
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
                      {log.log}
                    </h5>
                    <p className="font-normal text-gray-700 ">
                      Updated At : {format(log.createdAt, 'dd-MM-yyyy HH:mm')}
                    </p>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TransactionDetailPage;
