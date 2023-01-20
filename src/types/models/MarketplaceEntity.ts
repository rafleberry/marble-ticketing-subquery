// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




export type MarketplaceEntityProps = Omit<MarketplaceEntity, NonNullable<FunctionPropertyNames<MarketplaceEntity>>>;

export class MarketplaceEntity implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public type?: string;

    public price?: bigint;

    public reserve_price?: bigint;

    public denom?: string;

    public start?: bigint;

    public end?: bigint;

    public nft_infoId?: string;

    public bids?: number;

    public createdTime?: bigint;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save MarketplaceEntity entity without an ID");
        await store.set('MarketplaceEntity', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove MarketplaceEntity entity without an ID");
        await store.remove('MarketplaceEntity', id.toString());
    }

    static async get(id:string): Promise<MarketplaceEntity | undefined>{
        assert((id !== null && id !== undefined), "Cannot get MarketplaceEntity entity without an ID");
        const record = await store.get('MarketplaceEntity', id.toString());
        if (record){
            return this.create(record as MarketplaceEntityProps);
        }else{
            return;
        }
    }


    static async getByNft_infoId(nft_infoId: string): Promise<MarketplaceEntity[] | undefined>{
      
      const records = await store.getByField('MarketplaceEntity', 'nft_infoId', nft_infoId);
      return records.map(record => this.create(record as MarketplaceEntityProps));
      
    }


    static create(record: MarketplaceEntityProps): MarketplaceEntity {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new this(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
