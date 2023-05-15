// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




export type LogEntityProps = Omit<LogEntity, NonNullable<FunctionPropertyNames<LogEntity>>>;

export class LogEntity implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public log: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save LogEntity entity without an ID");
        await store.set('LogEntity', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove LogEntity entity without an ID");
        await store.remove('LogEntity', id.toString());
    }

    static async get(id:string): Promise<LogEntity | undefined>{
        assert((id !== null && id !== undefined), "Cannot get LogEntity entity without an ID");
        const record = await store.get('LogEntity', id.toString());
        if (record){
            return this.create(record as LogEntityProps);
        }else{
            return;
        }
    }



    static create(record: LogEntityProps): LogEntity {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new this(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
