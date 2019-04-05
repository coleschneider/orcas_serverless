import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { BaseError } from "./errorHandler";
type AsyncHandler = (event: APIGatewayEvent, context: Context) => Promise<APIGatewayProxyResult>

export const asyncMiddleware = (fn: AsyncHandler) =>
  async (event: APIGatewayEvent, context: Context) => {
    let res: APIGatewayProxyResult
    try {
      res = await fn(event, context)
    } catch (error) {
      res = {
        body: `{"message":"${error.message}"}`,
        statusCode: error instanceof BaseError ? error.statusCode : 500
      }
    }
    return res
  }
  export const successMessage = {
    message: 'Successfully subscribed to newsletter!',
    statusCode: 200
}
  export default asyncMiddleware