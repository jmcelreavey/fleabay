import { useState } from "react";
import { Button, NumberInput } from "@mantine/core";

import { Auction } from "@fleabay/db/schema";

export const BidInput = ({ auction }: { auction: Auction }) => {
  const fixedValue = Number(auction.current_price).toFixed(2);
  const [value, setValue] = useState(fixedValue);

  return (
    <NumberInput
      radius="sm"
      size="sm"
      width={20}
      placeholder="Place Bid"
      leftSection={<div>£</div>}
      defaultValue={value}
      value={value}
      step={0.01}
      onBlur={(value) => {
        if (value.currentTarget.value < auction.current_price) {
          setValue(fixedValue);
        } else {
          setValue(Number(value.currentTarget.value).toFixed(2));
        }
      }}
      rightSectionWidth={80}
      rightSection={<Button style={{ flex: 1 }}>Bid</Button>}
    />
  );
};
