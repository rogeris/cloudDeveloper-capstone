import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

export class TodosAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.ITEMS_TABLE,
    private readonly userIdIndex = process.env.USER_ID_INDEX) {
  }

  async createTodo(todoItem: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todoItem
    }).promise()

    return todoItem
  }

  async deleteTodo(itemId: string, userId: string): Promise<TodoItem> {
    const key = {
      itemId: itemId,
      userId: userId
    }

    const deletedTodo: unknown =  await this.docClient.delete({
      TableName: this.todosTable,
      Key: key
    }).promise()

    return deletedTodo as TodoItem
  }

  async getTodosByUserId(userId: string): Promise<TodoItem[]> {
    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        IndexName: this.userIdIndex,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId
        }
      })
      .promise();

    const items = result.Items
    return items as TodoItem[]
  }

  async updateTodo(userId: string, itemId: string, todoUpdate: TodoUpdate) {
    return await this.docClient
      .update({
        TableName: this.todosTable,
        Key: { userId, itemId },
        ExpressionAttributeNames: { "#N": "name" },
        UpdateExpression: "set #N=:todoName, dueDate=:dueDate, done=:done",
        ExpressionAttributeValues: {
          ":todoName": todoUpdate.name,
          ":dueDate": todoUpdate.dueDate,
          ":done": todoUpdate.done
        },
        ReturnValues: "UPDATED_NEW"
      })
      .promise();
  }

  async updateAttachmentUrl(itemId: string, userId: string, attachmentUrl: string) {
    return await this.docClient
      .update({
        TableName: this.todosTable,
        Key: { userId, itemId },
        UpdateExpression: "set attachmentUrl=:attachmentUrl",
        ExpressionAttributeValues: {
          ":attachmentUrl": attachmentUrl
        },
        ReturnValues: "UPDATED_NEW"
      })
      .promise();
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
