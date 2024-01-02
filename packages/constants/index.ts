import Decimal from "decimal.js";
import { z } from "zod";

export const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://www.fleabay.northern.ie"
    : "http://localhost:3000";

export const parseHourTo12HourFormat = (hour: number) => {
  if (hour === 0 || hour === 24) return "12 AM";
  else if (hour < 12) return `${hour} AM`;
  else if (hour === 12) return "12 PM";
  else return `${hour - 12} PM`;
};

export const DecimalZod = z.custom<Decimal>(
  (value) => value instanceof Decimal,
  { message: "Expected Decimal instance" },
);
