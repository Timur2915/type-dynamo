import { DynamoDB } from 'aws-sdk'
import { IHelpers, Omit } from '../../helpers'
import DynamoClient from '../dynamo-client'
import { buildExclusiveStartKey } from '../helpers'

export interface QueryResult<TableModel, KeySchema> {
  data: TableModel[]
  lastKey?: KeySchema
}

export async function queryPaginate<Entity, KeySchema>(queryInput: DynamoDB.QueryInput, dynamoPromise: DynamoClient): Promise<QueryResult<Entity, KeySchema>> {
  const queryOutput = await dynamoPromise.query(queryInput)
  const result: QueryResult<Entity, KeySchema> = {
    data: queryOutput.Items as any,
    lastKey: queryOutput.LastEvaluatedKey as any,
  }
  return result
}

export async function queryAllResults<Entity, KeySchema>(
  queryInput: DynamoDB.QueryInput, dynamoPromise: DynamoClient,
): Promise<Omit<QueryResult<Entity, KeySchema>, 'lastKey'>> {
  let lastKey
  const result: QueryResult<Entity, KeySchema> = {} as any
  do {
    const queryOutput = await dynamoPromise.query(queryInput)
    if (!result.data) {
      result.data = new Array<Entity>()
    }
    result.data = result.data.concat(queryOutput.Items as any)
    lastKey = queryOutput.LastEvaluatedKey
    if (lastKey) {
      queryInput.ExclusiveStartKey = buildExclusiveStartKey(lastKey)
    }
  } while (lastKey)
  return result
}

export interface IQueryInput<PartitionKey> {
  tableName: string,
  partitionKey: PartitionKey
}

export class Query<Model, PartitionKey> {
  private dynamoClient: DynamoClient
  private helpers: IHelpers

  public constructor(dynamoClient: DynamoClient, helpers: IHelpers) {
    this.dynamoClient = dynamoClient
    this.helpers = helpers
  }

  public async execute(input: IQueryInput<PartitionKey>) {
    const dynamoQueryInput = this.buildDynamoQueryInput(input)
    await this.dynamoClient.query(dynamoQueryInput)
  }

  private buildDynamoQueryInput(
    input: IQueryInput<PartitionKey>,
  ): DynamoDB.QueryInput {
    return {
      TableName: input.tableName,
      ExpressionAttributeNames: this.helpers.expressionAttributeNamesGenerator.generateExpression(Object.keys(input.partitionKey)),
      ExpressionAttributeValues: this.helpers.expressionAttributeValuesGenerator.generateExpression(input.partitionKey[Object.keys(input.partitionKey)[0]]),
    }
  }
}
