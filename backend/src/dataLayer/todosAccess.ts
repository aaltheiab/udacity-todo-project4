import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { TodoUpdate } from '../models/TodoUpdate'

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

  async updateTodo(userId: string, todoId: string, updatedTodo: TodoUpdate): Promise<TodoItem> {

    var params = {
      TableName: this.todosTable,
      Key: {
        "userId": userId,
        "todoId": todoId
      },
      UpdateExpression: "set #name = :name, dueDate = :dueDate, done = :done",
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ":name": updatedTodo.name,
        ":dueDate": updatedTodo.dueDate,
        ":done": updatedTodo.done
      },
      ReturnValues: "UPDATED_NEW"
    };

    // source:
    // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.03
    const updatedItem = await this.docClient.update(params).promise();

    return updatedItem.Attributes as TodoItem
  }


  async deleteTodo(userId: string, todoId: string): Promise<void> {

    var params = {
      TableName: this.todosTable,
      Key: {
        "userId": userId,
        "todoId": todoId
      }
    };

    // source:
    // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.06
    await this.docClient.delete(params).promise();
  }

}

