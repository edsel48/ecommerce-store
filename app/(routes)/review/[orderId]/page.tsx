'use client';

import Button from '@/components/ui/button';
import axios from 'axios';
import { Star, StarOff } from 'lucide-react';
import useCart from '@/hooks/use-cart';

import { useParams, useRouter } from 'next/navigation';

import React, { useState } from 'react';

const ReviewPage: React.FC = async () => {
  const router = useRouter();

  const params = useParams();

  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  const cart = useCart();

  const { items, addItem, removeItem, addQuantity, removeQuantity, removeAll } =
    cart;

  const onSubmit = async () => {
    let response = await axios.post('/api/review', {
      orderId: params.orderId,
      starRating: rating,
      review,
    });

    cart.removeAll();
    router.replace('/cart', undefined);
  };

  return (
    <div className="flex-col">
      <div>
        {[...Array(5)].map((e, i) => {
          if (i + 1 >= rating) {
            return (
              <Star
                onClick={() => {
                  setRating(i + 1);
                }}
              />
            );
          } else {
            return <StarOff />;
          }
        })}
      </div>
      <div>
        <input
          type="text"
          onBlur={(e) => {
            setReview(e.currentTarget.value);
          }}
        />
      </div>
      <Button
        onClick={async () => {
          await onSubmit();
        }}
      >
        {' '}
        Submit{' '}
      </Button>
    </div>
  );
};

export default ReviewPage;
