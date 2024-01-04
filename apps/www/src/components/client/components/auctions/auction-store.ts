import { create } from "zustand";

import type { RouterOutputs } from "@fleabay/api";

type Auction = RouterOutputs["auction"]["getAll"][number];

interface Store {
  auctions: Auction[];
  setAuctions: (auctions: Auction[]) => void;
  getAuction: (id: number) => Auction | undefined;
}

export const useAuctionStore = create<Store>((set, get) => ({
  auctions: [],
  setAuctions: (auctions) => set(() => ({ auctions })),
  getAuction: (id) => {
    const { auctions } = get();
    return auctions.find((a) => a.id === id);
  },
}));
