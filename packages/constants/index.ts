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

export const FAQs: { id: string; question: string; answer: string }[] = [
  {
    id: "how-safe-is-fleabay",
    question: "How safe is fleabay?",
    answer:
      "fleabay is an open-source software, which means that the source code is available to the public for review and improvement. Open-source software is generally considered safe because it allows for greater transparency and accountability in the development process.",
  },
  {
    id: "does-fleabay-offer-real-time-vote-count",
    question: "Does fleabay offer real-time vote count?",
    answer:
      "Yes, fleabay provides a real-time vote count feature. However, during an ongoing election, the candidate's name in the real-time vote count page will not be revealed until the election has ended.",
  },
  {
    id: "can-i-have-a-position-with-multiple-selections-such-as-senators",
    question:
      "Can I have a position with multiple selections, such as Senators?",
    answer:
      "Yes, you can customize the positions in the position dashboard page based on the requirements of your election.",
  },
  {
    id: "can-i-view-the-elections-real-time-vote-count-even-if-im-not-a-voter",
    question:
      "Can I view the election's real-time vote count even if I'm not a voter?",
    answer: `It depends on the election's publicity settings. fleabay offers three types of publicity settings: "Private" where only the election commissioner can see the election; "Voter" where the election is visible to both the commissioner and voters; and "Public" where the election's information and real-time vote count are publicly available.`,
  },
  {
    id: "can-an-election-commissioner-vote-in-their-own-election",
    question: "Can an Election Commissioner vote in their own election?",
    answer:
      "Yes, the election commissioner can add themselves to the voter's list and vote in their own election.",
  },
  {
    id: "do-i-need-to-create-multiple-accounts-for-different-elections",
    question: "Do I need to create multiple accounts for different elections?",
    answer:
      "No, you can manage and vote in multiple elections with a single account. Simply visit your dashboard to view and manage your elections.",
  },
  {
    id: "can-i-participate-in-multiple-elections-simultaneously",
    question: "Can I participate in multiple elections simultaneously?",
    answer:
      "Yes, as an election commissioner and voter, you can participate in multiple ongoing elections without the need to create another account.",
  },
  {
    id: "is-fleabay-only-available-at-cavite-state-university",
    question: "Is fleabay only available at Cavite State University?",
    answer:
      "No, fleabay is available for any type of organization that requires secure and flexible online voting.",
  },
  {
    id: "can-i-use-fleabay-for-supreme-student-government-ssg-elections",
    question:
      "Can I use fleabay for Supreme Student Government (SSG) Elections?",
    answer:
      "Yes, fleabay offers a template for SSG Elections, and you can customize it further in the dashboard page to suit your specific requirements.",
  },
];
