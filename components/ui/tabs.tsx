import { useEffect, useState } from 'react';
import { Tab } from '@headlessui/react';
import axios from 'axios';
import { BookCheck, Loader, Truck, Wallet } from 'lucide-react';

// @ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Tabs() {
  const [transactions, setTransactions] = useState([]);

  let [categories, setCategories] = useState({
    Paid: [],
    Processed: [],
    Shipping: [],
    Finished: [],
    Canceled: [],
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        let response = await axios.get(`/api/transactions`);
        let { data } = response;

        setTransactions(data);

        let categories = {
          paid: [],
          processed: [],
          shipping: [],
          finished: [],
          canceled: [],
        };

        // @ts-ignore
        data.forEach((e) => {
          // @ts-ignore
          categories[`${e.status}`.toLowerCase()].push(e);
        });

        // @ts-ignore
        setCategories(categories);
      } catch (e) {
        console.error(e);
      }
    };

    fetch();
  }, []);

  return (
    <Tab.Group>
      <Tab.List className="flex space-x-1 rounded-xl bg-black p-1">
        {Object.keys(categories).map((category) => (
          <Tab
            key={category}
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white-400 ring-white/60 ring-offset-2 focus:outline-none focus:ring-2',
                selected
                  ? 'text-black-700 bg-white shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',
              )
            }
          >
            {category.charAt(0).toUpperCase() +
              category.substring(1).toLowerCase()}{' '}
            - [{' '}
            {
              // @ts-ignore
              categories[category].length
            }{' '}
            ]
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="mt-2 rounded-md border border-black">
        {Object.values(categories).map((data, idx) => (
          <Tab.Panel
            key={idx}
            className={classNames(
              'rounded-xl bg-white p-3',
              'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
            )}
          >
            <ul>
              {data.map((item) => (
                <li
                  key={idx}
                  className="relative rounded-md p-3 hover:bg-gray-100"
                >
                  <h3 className="text-sm font-medium leading-5">
                    {/* @ts-ignore */}
                    Order : {item.id}
                  </h3>

                  <ul className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
                    {/* @ts-ignore */}
                    <li>{item.createdAt}</li>
                    <li>&middot;</li>
                    {/* @ts-ignore */}
                    <li>{item.grandTotal}</li>
                  </ul>

                  <a
                    //   @ts-ignore
                    href={`/transactions/${item.id}`}
                    className={classNames(
                      'absolute inset-0 rounded-md',
                      'ring-blue-400 focus:z-10 focus:outline-none focus:ring-2',
                    )}
                  />
                </li>
              ))}
            </ul>
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}
