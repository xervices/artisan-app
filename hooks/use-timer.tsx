import { useState, useEffect } from 'react';

interface TimerProps {
  hr?: number;
  min?: number;
  sec?: number;
}

export function useTimer({ hr = 0, min = 0, sec = 0 }: TimerProps) {
  const [hours, setHours] = useState<number>(hr);
  const [minute, setMinute] = useState<number>(min);
  const [seconds, setSeconds] = useState<number>(sec);

  useEffect(() => {
    // Reset the timer based on new props
    setHours(hr);
    setMinute(min);
    setSeconds(sec);
  }, [hr, min, sec]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev === 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (minute > 0 && seconds === 0) {
      setSeconds(59);
      setMinute((prev) => {
        if (prev === 0) return 0;
        return prev - 1;
      });
    }
  }, [seconds]);

  useEffect(() => {
    if (hours > 0 && minute === 0) {
      setMinute(59);
      setHours((prev) => {
        if (prev === 0) return 0;
        return prev - 1;
      });
    }
  }, [minute]);

  const formatTime = (value: number) => String(value).padStart(2, '0');

  return {
    hours: formatTime(hours),
    minute: formatTime(minute),
    seconds: formatTime(seconds),
  };
}
