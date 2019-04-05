import { APIGatewayProxyResult, APIGatewayEvent, APIGatewayEventRequestContext } from 'aws-lambda';
import axios from 'axios';
import 'source-map-support/register';

const serviceInstance = axios.create({
  baseURL: `https://${process.env.DC}.api.mailchimp.com/3.0`,
})


type StatusTypes = 'subscribed' | 'unsubscribed'

interface Member {
  email_address: string;
  status: StatusTypes
}
interface SubscriptionBody {
  email_address: string
}
export class ServiceError extends Error {
  code: number = 502
}
export class InternalServerError extends ServiceError {
  code: number = 500;
}

class BadRequest extends Error {
  code: number = 400
}

const generateErrorResponse = (err):APIGatewayProxyResult =>{
  const finalErr = (() => {
    if(err instanceof BadRequest) return err
    return new InternalServerError(); //dont return error data about errors we cant predict
  })()
  return generateResponse({
    status: 502,
    headers: { 
      "Access-Control-Allow-Origin": "*" 
  },
     data: err
    })
}

const generateResponse = (result):APIGatewayProxyResult =>({
  statusCode: result.status,
  headers: { 
    "Access-Control-Allow-Origin": "*" 
},
  body: JSON.stringify(result.data)
})
const generateMemberSubs = ({email_address}: SubscriptionBody):Member => ({
  email_address,
  status: 'subscribed'
})


export const run = async (event: APIGatewayEvent, _context: APIGatewayEventRequestContext) => {
  let body = JSON.parse(event.body);
  try {
    if(!body.email_address) throw new BadRequest('Email is required')
    const memberBody = {members: [generateMemberSubs(body)]};
    const result = await serviceInstance.post(`/lists/${process.env.LIST}`, memberBody, {
          headers: {'Authorization': `user ${process.env.API_CHIMP}`}
    })
    return generateResponse(result)
  } catch(e){
    return generateErrorResponse(e)
  }
}
