import { 
  CollectionEntity, 
  NftEntity, 
  BidType, 
  MarketplaceEntity,
} from "../types";
import {
  CosmosEvent,
} from "@subql/types-cosmos";
import { Attribute } from "@cosmjs/stargate/build/logs";

const factoryDefaultResponse = {
  action: "",
  address: "",
  uri: "",
  name: "",
  category:"",
  id:"",
  creator: "",
}
const nftDefaultResponse = {
  _contract_address: "",
  minter:"",
  owner: "",
  img_url: "",
  token_id: "",
  name: "",
  action: "",
  recipient: ""
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
  "marble-recipient":""
}

export async function handleCollectionEvent(event: CosmosEvent): Promise<void> {
  const attr = event.event.attributes;
  const data = await parseAttributes(attr,factoryDefaultResponse);
  if(data.action=="add_user_collection") {
    const collectionEntity = CollectionEntity.create({
      id: data.address,
      name: data.name,
      creator: data.creator,
      category: data.category,
      collection_id: data.id,
      createdTime: BigInt(Date.now())
    })
    await collectionEntity.save();
    return;
  }
  if(data.action=="edit_collection") {
    let collectionEntity = await CollectionEntity.get(data.address);
    if (collectionEntity == undefined) return;
    collectionEntity.uri = data.uri;
    collectionEntity.category = data.category;
    await collectionEntity.save();
    return;
  }
  if(data.action=="remove_collection") {
    await CollectionEntity.remove(data.address);
    return;
  }
  return;
  }
export async function handleNFTEvent(event: CosmosEvent): Promise<void> {
  const attr = event.event.attributes;
  const data = await parseAttributes(attr,nftDefaultResponse);
  const collection_data = await CollectionEntity.get(data._contract_address);
  if(collection_data == undefined) return;
  const nft_id = data._contract_address+":"+data.token_id;

  if(data.action=="mint") {
    const nftEntity = NftEntity.create({
      id: nft_id,
      name: data.name,
      image_url: data.img_url,
      creator: data.minter,
      owner: data.owner,
      collectionId: data._contract_address,
      createdTime: BigInt(Date.now())
    })
    await nftEntity.save();
    return;
  }
  if(data.action=="burn") {
    await NftEntity.remove(nft_id);
    return;
  }
  if(data.action=="transfer_nft") {
    let nftEntity = await NftEntity.get(nft_id);
    if(nftEntity == undefined) return;
    nftEntity.owner = data.recipient;
    await nftEntity.save();
    return;
  }
}
export async function handleMarketplaceEvent(event: CosmosEvent): Promise<void> {
  const attr = event.event.attributes;
  const data = await parseAttributes(attr,marketDefaultResponse);
  const nft_id = data.nft_address+":"+data.token_id;
  if(data["marble-action"]=="start_sale") {
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
      bids: 0
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