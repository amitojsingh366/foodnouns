import { Auction } from '../wrappers/nounsAuction';
import { AuctionState } from '../state/slices/auction';
import { BigNumber } from '@ethersproject/bignumber';

export const isNounderNoun = (nounId: BigNumber) => {
  return nounId.mod(10).eq(0) || nounId.eq(0) || nounId.mod(10).eq(1) || nounId.eq(1);
};

const emptyNounderAuction = (onDisplayAuctionId: number): Auction => {
  return {
    amount: BigNumber.from(0).toJSON(),
    bidder: '',
    startTime: BigNumber.from(0).toJSON(),
    endTime: BigNumber.from(0).toJSON(),
    nounId: BigNumber.from(onDisplayAuctionId).toJSON(),
    settled: false,
  };
};

const findAuction = (id: BigNumber, auctions: AuctionState[], isFoodnoun = true): Auction | undefined => {
  if (isFoodnoun) {
    return auctions.find(auction => {
      return BigNumber.from(auction.foodnouns.activeAuction?.nounId).eq(id);
    })?.foodnouns.activeAuction;
  } else {
    return auctions.find(auction => {
      return BigNumber.from(auction.nouns.activeAuction?.nounId).eq(id);
    })?.nouns.activeAuction;
  }
};

/**
 *
 * @param nounId
 * @param pastAuctions
 * @returns empty `Auction` object with `startTime` set to auction after param `nounId`
 */
export const generateEmptyNounderAuction = (
  nounId: BigNumber,
  pastAuctions: AuctionState[],
  isFoodnoun = true,
): Auction => {
  const nounderAuction = emptyNounderAuction(nounId.toNumber());
  // use nounderAuction.nounId + 1 to get mint time
  const auctionAbove = findAuction(nounId.add(1), pastAuctions, isFoodnoun);
  const auctionAboveStartTime = auctionAbove && BigNumber.from(auctionAbove.startTime);
  if (auctionAboveStartTime) nounderAuction.startTime = auctionAboveStartTime.toJSON();

  return nounderAuction;
};
