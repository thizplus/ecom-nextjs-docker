import React, { useState, useEffect, useCallback } from 'react';

interface CountdownTimerProps {
  expireTime: Date | string;  // เพิ่ม Date type
  onExpire: () => void;
  isActive?: boolean;
}

interface TimeLeft {
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  expireTime,
  onExpire,
  isActive = true
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    minutes: 15,
    seconds: 0
  });

  const [isExpired, setIsExpired] = useState<boolean>(false);

  const calculateTimeLeft = useCallback(() => {
    const now = new Date().getTime();


    // แปลง expireTime เป็น Date object ถ้าเป็น string
    const expireDate = typeof expireTime === 'string'
      ? new Date(expireTime).getTime()
      : expireTime.getTime();

    const difference = expireDate - now;

    if (difference <= 0) {
      setIsExpired(true);
      onExpire();

      return { minutes: 0, seconds: 0 };
    }

    return {
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }, [expireTime, onExpire]);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      const newTime = calculateTimeLeft();

      setTimeLeft(newTime);

      if (newTime.minutes === 0 && newTime.seconds === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, calculateTimeLeft]);

  if (!isActive) return null;

  return (
    <div className="text-center mt-4">
      {isExpired ? (
        <p className="text-red-500 font-semibold">
          หมดเวลาชำระเงิน กรุณาทำรายการใหม่
        </p>
      ) : (
        <p>
          <span>เวลาที่เหลือในการชำระเงิน: </span>
          <span className="font-semibold">
            {String(timeLeft.minutes).padStart(2, '0')}:
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
        </p>
      )}
    </div>
  );
};

export default CountdownTimer;
