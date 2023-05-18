// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




export type NftEntityProps = Omit<NftEntity, NonNullable<FunctionPropertyNames<NftEntity>>>;

export class NftEntity implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public event_id: string;

    public minter: string;

    public owner: string;

    public ticket_type: string;

    public event_infoId: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save NftEntity entity without an ID");
        await store.set('NftEntity', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove NftEntity entity without an ID");
        await store.remove('NftEntity', id.toString());
    }

    static async get(id:string): Promise<NftEntity | undefined>{
        assert((id !== null && id !== undefined), "Cannot get NftEntity entity without an ID");
        const record = await store.get('NftEntity', id.toString());
        if (record){
            return this.create(record as NftEntityProps);
        }else{
            return;
        }
    }


    static async getByEvent_infoId(event_infoId: string): Promise<NftEntity[] | undefined>{
      
      const records = await store.getByField('NftEntity', 'event_infoId', event_infoId);
      return records.map(record => this.create(record as NftEntityProps));
      
    }


    static create(record: NftEntityProps): NftEntity {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new this(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
