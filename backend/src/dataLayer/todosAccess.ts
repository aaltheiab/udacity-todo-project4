import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'

function createDynamoDBClient() {
  return new AWS.DynamoDB.DocumentClient()
}

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE) {
  }

  async getTodos(userId: string): Promise<TodoItem[]> {
    console.log('Getting all Todos')

    const result = await this.docClient.query({
      TableName: this.todosTable,
      // IndexName : imageIdIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async createTodo(userId: string, todoId: string, newTodo: CreateTodoRequest): Promise<TodoItem> {
    const createdAt = new Date().toISOString()

    const newItem = {
      userId,
      todoId,
      createdAt,
      done: false,
      ...newTodo
    }

    await this.docClient.put({
      TableName: this.todosTable,
      Item: newItem
    }).promise()

    return newItem as TodoItem
  }
}

