import 'source-map-support/register'
import * as uuid from 'uuid'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils'
import {createTodo} from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
const logger = createLogger('createTodos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)

    logger.info('creating a new TODO Item. User Authenticated successfully', event)


    // TODO: Implement creating a new TODO item
    const todoId = uuid.v4();
    const userId = getUserId(event)
    const result = await createTodo(userId, todoId, newTodo)

    logger.info('UserId Fetched + created a new TODO Item.', {
        todoId,
        userId
    })

    return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            item: result
        })
    }  
}