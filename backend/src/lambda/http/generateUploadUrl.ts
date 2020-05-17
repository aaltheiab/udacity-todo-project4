import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { getUserId } from '../utils'
import { updateTodoImageUrl } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('generateUploadUrl')
const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})

const docClient = new XAWS.DynamoDB.DocumentClient()
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const todosTable = process.env.TODOS_TABLE


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)

    logger.info('Generating TODO Item Image Url. User Authenticated successfully', event)

    const validTodoId = await todoExists(userId, todoId)

    if (!validTodoId) {
        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                error: 'TODO does not exist'
            })
        }
    }

    logger.info('TODO Id passed existence validation', {
        todoId,
        userId
    })

    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const uploadUrl = getUploadUrl(todoId)

    const imageUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`

    await updateTodoImageUrl(userId, todoId, imageUrl)

    logger.info('imageUrl saved with Todo Object Successfully', {
        imageUrl
    })

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            uploadUrl
        })
    }
}


async function todoExists(userId: string, todoId: string) {
    const result = await docClient.get({
        TableName: todosTable,
        Key: {
            userId: userId,
            todoId: todoId
        }
    }).promise()

    return !!result.Item
}

function getUploadUrl(todoId: string) {
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: todoId,
        Expires: parseInt(urlExpiration)
    })
}
