import { scan as Scan, ScanResult } from '../databaseOperations/scan'
import { TableSchema } from './'
import { DynamoEntity } from './DynamoEntity'

class DynamoTable<Table, KeySchema> extends DynamoEntity<Table, KeySchema> {

    constructor(
        tableSchema: TableSchema,
    ) {
        super({
            tableName: tableSchema.tableName,
            tableSchema,
        })
    }

    public putItem() {
        return Scan<Table, KeySchema>(this._entitySchema)
    }

    public getItem() {
        return Scan<Table, KeySchema>(this._entitySchema)
    }

    public batchGet() {
        return Scan<Table, KeySchema>(this._entitySchema)
    }

    public batchWrite() {
        return Scan<Table, KeySchema>(this._entitySchema)
    }

}

export default DynamoTable

// declarar os gllobal indexes (index name, projection type e algumas options)
