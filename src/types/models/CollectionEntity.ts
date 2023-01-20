// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




export type CollectionEntityProps = Omit<CollectionEntity, NonNullable<FunctionPropertyNames<CollectionEntity>>>;

export class CollectionEntity implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public name?: string;

    public creator?: string;

    public category?: string;

    public collection_id?: string;

    public uri?: string;

    public createdTime?: bigint;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save CollectionEntity entity without an ID");
        await store.set('CollectionEntity', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove CollectionEntity entity without an ID");
        await store.remove('CollectionEntity', id.toString());
    }

    static async get(id:string): Promise<CollectionEntity | undefined>{
        assert((id !== null && id !== undefined), "Cannot get CollectionEntity entity without an ID");
        const record = await store.get('CollectionEntity', id.toString());
        if (record){
            return this.create(record as CollectionEntityProps);
        }else{
            return;
        }
    }



    static create(record: CollectionEntityProps): CollectionEntity {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new this(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
