'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';

function StatBox({ label, value }: { label: string; value: number; }) {
  return (
    <li className="p-4 w-full text-center">
      <p className="text-3xl font-bold">{value}</p>
      <p>{label}</p>
    </li>
  );
}

// Static target date
const TARGET_DATE = new Date('2100-01-01T00:00:00');

// Function to calculate time remaining
function calculateTimeRemaining(targetDate: Date) {
  const currentTime = new Date();
  const timeDifference = Math.max(Number(targetDate) - Number(currentTime), 0);

  return {
    days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
    hours: Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    ),
    minutes: Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    ),
    seconds: Math.floor(
      (timeDifference % (1000 * 60)) / 1000
    )
  };
}

export default function DealCountdown() {
  const [time, setTime] = useState<ReturnType<typeof calculateTimeRemaining>>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Calculate initial time on client
    setTime(calculateTimeRemaining(TARGET_DATE)); 

    const timerInterval = setInterval(() => {
      const newTime = calculateTimeRemaining(TARGET_DATE);
      setTime(newTime);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  if (!time) return (
    <section className="grid grid-cols-1 md:grid-cols-2 my-20">
      <div className="flex flex-col gap-2 justify-center">
        <h3 className="text-3xl font-bold">Loading Countdown...</h3>
      </div>
    </section>
  );

  if (
    time.days === 0 && 
    time.hours === 0 &&
    time.minutes === 0 && 
    time.seconds === 0
  ) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 my-20">
        <div className="flex flex-col gap-2 justify-center">
          <h3 className="text-3xl font-bold">Deal Has Ended</h3>
          <div className="flex gap-3">
            <p className="mt-2">
              Oops...This deal is no longer available!
            </p>
            <div className="text-center">
              <Button asChild>
                <Link href="/search">
                  View Products
                </Link>
              </Button>
            </div>
          </div>
          
        </div>
        <div className="flex justify-center">
          <Image src="/images/promo.jpg" alt="promotion" height={200} width={400} />
        </div>
      </section>
    );
  }
  return(
    <section className="grid grid-cols-1 md:grid-cols-2 my-20">
      <div className="flex flex-col gap-2 justify-center">
        <h3 className="text-3xl font-bold">Deal of the Month</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum iusto blanditiis vitae sequi. 
          Zaudantium itaque tempora, deleniti reiciendis doloremque molestias accusamus laborum repudiandae dolor. 
          Bignissimos accusantium, recusandae natus assumenda unde? Mollitia quam laudantium labore rerum dolor, dolorum, 
          assumenda deleniti ducimus delectus veritatis, fugiat corporis! Eos sapiente error dicta esse nam. 
        </p>
        <ul className="grid grid-cols-4">
          <StatBox label="Days" value={time.days} />
          <StatBox label="Hours" value={time.hours} />
          <StatBox label="Minutes" value={time.minutes} />
          <StatBox label="Seconds" value={time.seconds} />
        </ul>
        <div className="text-center">
          <Button asChild>
            <Link href="/search">
              View Products
            </Link>
          </Button>
        </div>
      </div>
      <div className="flex justify-center">
        <Image src="/images/promo.jpg" alt="promotion" height={200} width={400} />
      </div>
    </section>
  );
}