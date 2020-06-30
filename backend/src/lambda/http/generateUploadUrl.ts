import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUploadUrl, getAttachmentUrl } from '../../DAOs/s3DAO'
import { updateAttachmentUrl } from '../../logic/todoLogic'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const itemId = event.pathParameters.itemId
  const uploadUrl = getUploadUrl(itemId)
  const attachmentUrl = getAttachmentUrl(itemId)

  await updateAttachmentUrl(itemId, attachmentUrl, jwtToken)
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: uploadUrl
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)