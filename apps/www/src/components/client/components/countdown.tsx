import { useEffect, useState } from "react";

const Countdown = ({ endTime }: { endTime: Date }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(endTime) - +new Date();
    let timeLeft = undefined;

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hrs: Math.floor((difference / (1000 * 60 * 60)) % 24).toString(),
        mins: Math.floor((difference / 1000 / 60) % 60).toString(),
        secs: Math.floor((difference / 1000) % 60)
          .toString()
          .padStart(2, "0"),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <div>
      {timeLeft &&
        Object.entries(timeLeft).map(([unit, value]) => {
          return (
            <span key={unit}>
              {value} {unit}{" "}
            </span>
          );
        })}
    </div>
  );
};

export default Countdown;
