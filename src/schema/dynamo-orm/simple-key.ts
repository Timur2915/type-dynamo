import { IndexSchema, TableSchema } from '../'
import DynamoPromise from '../../database-operations/dynamo-to-promise'
import { DynamoTableWithSimpleKey } from '../dynamo-table'
import { DynamoTableWithCompositeKey } from '../dynamo-table'

export class DynamoORMWithSimpleKey<
    Table,
    PartitionKey,
    GlobalIndexes,
    LocalIndexes
> extends DynamoTableWithSimpleKey<Table, PartitionKey> {
    public onIndex: GlobalIndexes & LocalIndexes
    private globalIndexes: GlobalIndexes
    private localIndexes: LocalIndexes
    constructor(
        tableSchema: TableSchema,
        globalIndexes: GlobalIndexes,
        localIndexes: LocalIndexes,
        dynamoPromise: DynamoPromise,
    ) {
        super(tableSchema, dynamoPromise)
        this.globalIndexes = globalIndexes
        this.localIndexes = localIndexes
        this.onIndex = Object.assign({}, this.globalIndexes, this.localIndexes)
        this.injectTableNameOnIndexes()
        this.injectDynamoPromiseOnIndexes()
    }

    private injectTableNameOnIndexes() {
        for (const index in this.onIndex as any) {
            if (this.onIndex.hasOwnProperty(index)) {
                this.onIndex[index]._entitySchema.tableName = (this as any)._entitySchema.tableName
            }
        }
    }

    private injectDynamoPromiseOnIndexes() {
        for (const index in this.onIndex as any) {
            if (this.onIndex.hasOwnProperty(index)) {
                this.onIndex[index]._entitySchema.dynamoPromise = (this as any)._entitySchema.dynamoPromise
            }
        }
    }
}
