import { 
  NftEntity, 
  BidType, 
  MarketplaceEntity,
  EventEntity,
  LogEntity,
} from "../types";
import {
  CosmosEvent,
} from "@subql/types-cosmos";
import { Attribute } from "@cosmjs/stargate/build/logs";

const factoryDefaultResponse = {
  factory_action: "",
  address: "",
  creator: "",
  event_id: "",
  start_time:"",
  end_time:"",
  name: "",
  img: "",
  denom: "",
  place: ""
}
const nftDefaultResponse = {
  _contract_address: "",
  minter:"",
  owner: "",
  img_url: "",
  token_id: "",
  name: "",
  action: "",
  recipient: "",
  vr_uri: "",
  ar_uri: "",
}
const marketDefaultResponse = {
  "marble-action": "",
  denom: "",
  nft_address: "",
  token_id: "",
  sale_type: "",
  initial_price:"",
  reserve_price: "",
  start: "",
  end: "",
  bidder: "",
  price: "",
  "marble-sender": "",
  "marble-recipient":"",
  buyer_id: "",
  pending_status: false,
  category: ""
}

export async function handleCollectionEvent(event: CosmosEvent): Promise<void> {
  const attr = event.event.attributes;
  const logEntity = LogEntity.create({
    id: Date.now().toString(),
    log: JSON.stringify(attr)
  })
  await logEntity.save();
  const data = await parseAttributes(attr,factoryDefaultResponse);
  if(data.factory_action=="add_event") {
    const collectionEntity = EventEntity.create({
      id: data.event_id,
      name: data.name,
      creator: data.creator,
      address: data.address,
      start_time: BigInt(data.start_time),
      end_time: BigInt(data.end_time),
      img: data.img,
      denom: data.denom,
      place: data.place,
      updated_time: BigInt(Date.now())
    })
    await collectionEntity.save();
    return;
  }
}
export async function handleNFTEvent(event: CosmosEvent): Promise<void> {
  // const attr = event.event.attributes;
  // let flag = false;
  // let data = nftDefaultResponse;
  // let collection_data;
  // for (const item of attr) {
  //   if(item.key=="_contract_address") {
  //     let _collection_data = await EventEntity.get(item.value);
  //     if(_collection_data==undefined) flag=false;
  //     else {
  //       flag = true;
  //       collection_data = _collection_data;
  //     }
  //   }
  //   if(!flag) continue;
  //   data[item.key] = item.value;
  // }
  // if(collection_data == undefined) return;
  // const nft_id = data._contract_address+":"+data.token_id;

  // if(data.action=="mint") {
  //   const nftEntity = NftEntity.create({
  //     id: nft_id,
  //     name: data.name,
  //     image_url: data.img_url,
  //     creator: data.minter,
  //     owner: data.owner,
  //     collectionId: data._contract_address,
  //     createdTime: BigInt(Date.now())
  //   })
  //   await nftEntity.save();
  //   return;
  // }
  // if(data.action=="burn") {
  //   await NftEntity.remove(nft_id);
  //   return;
  // }
  // if(data.action=="transfer_nft") {
  //   let nftEntity = await NftEntity.get(nft_id);
  //   if(nftEntity == undefined) return;
  //   nftEntity.owner = data.recipient;
  //   await nftEntity.save();
  //   return;
  // }
}
export async function handleMarketplaceEvent(event: CosmosEvent): Promise<void> {
  const attr = event.event.attributes;
  const data = await parseAttributes(attr,marketDefaultResponse);
  const nft_id = data.nft_address+":"+data.token_id;
  const nftInfo = await NftEntity.get(nft_id);

  if(data["marble-action"]=="start_sale") {
    let owner="";
    let creator = "";
    if(nftInfo) {
      owner=nftInfo.owner;
      creator = nftInfo.creator;
    }
    const marketplaceEntity = MarketplaceEntity.create({
      id: nft_id,
      type: data.sale_type,
      price: BigInt(data.initial_price),
      reserve_price: BigInt(data.reserve_price),
      denom: data.denom,
      start: BigInt(data.start),
      end: BigInt(data.end),
      nft_infoId:nft_id,
      createdTime: BigInt(Date.now()),
      bids: 0,
      owner: owner,
      creator: creator
    })
    await marketplaceEntity.save();
    return;
  }
  if(data["marble-action"]=="add_bid") {
    let marketplaceEntity = await MarketplaceEntity.get(nft_id);
    if(marketplaceEntity==undefined) return;
    let bids = marketplaceEntity.bids;
    marketplaceEntity.bids = bids+1;
    await marketplaceEntity.save();
    return;
  }
  if(data["marble-action"]=="cancel_bid") {
    let marketplaceEntity = await MarketplaceEntity.get(nft_id);
    if(marketplaceEntity==undefined) return;
    let bids = marketplaceEntity.bids;
    marketplaceEntity.bids = bids-1;
    await marketplaceEntity.save();
    return;
  }
  if(data["marble-action"]=="on_shipping") {
    let marketplaceEntity = await MarketplaceEntity.get(nft_id);
    marketplaceEntity.price = BigInt(data.price);
    marketplaceEntity.buyer_id = data.buyer_id;
    await marketplaceEntity.save();
  }
  if(data["marble-action"]=="cancel_sale") {
    await MarketplaceEntity.remove(nft_id);
    return;
  }
  if(data["marble-action"]=="accept_sale") {
    await MarketplaceEntity.remove(nft_id);
    return;
  }
  if(data["marble-action"]=="fixed_sell") {
    await MarketplaceEntity.remove(nft_id);
    return;
  }
  if(data["marble-action"]=="finish_sale") {
    await MarketplaceEntity.remove(nft_id);
    return;
  }
}
const parseAttributes = async (
  attr: readonly Attribute[],
  defaultResponse: any
) => {
  let data = defaultResponse;
  attr.map(({ key, value }) => {
    let obj = {};
    obj =  { [key]: value };
    data = { ...data, ...obj };
  });

  return data;
};