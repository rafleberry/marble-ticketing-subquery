// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




export type EventEntityProps = Omit<EventEntity, NonNullable<FunctionPropertyNames<EventEntity>>>;

export class EventEntity implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public event_id: string;

    public creator: string;

    public start_time: bigint;

    public end_time: bigint;

    public name: string;

    public img: string;

    public denom: string;

    public place: string;

    public updated_time: bigint;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save EventEntity entity without an ID");
        await store.set('EventEntity', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove EventEntity entity without an ID");
        await store.remove('EventEntity', id.toString());
    }

    static async get(id:string): Promise<EventEntity | undefined>{
        assert((id !== null && id !== undefined), "Cannot get EventEntity entity without an ID");
        const record = await store.get('EventEntity', id.toString());
        if (record){
            return this.create(record as EventEntityProps);
        }else{
            return;
        }
    }



    static create(record: EventEntityProps): EventEntity {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new this(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
