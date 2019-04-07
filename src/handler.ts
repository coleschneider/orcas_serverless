import axios from 'axios';
import 'source-map-support/register';
import asyncMiddleware, { successMessage } from '../utils/asyncMiddleware';
import { BadRequest } from '../utils/errorHandler';

const isProd = process.env.NODE_ENV === 'production';
const isOffline = process.env.IS_OFFLINE === 'true'
const listId = process.env.LIST_ID;
const dataCenter = process.env.DATA_CENTER;
const apiChimpKey = process.env.API_CHIMP_KEY;

type StatusTypes = 'subscribed' | 'unsubscribed' | 'pending'

interface Member {
  email_address: string;
  status: StatusTypes,
}
interface SubscriptionBody {
  email_address: string
}

const serviceInstance = axios.create({
  baseURL: `https://${dataCenter}.api.mailchimp.com/3.0`,
  headers: {'Authorization': `user ${apiChimpKey}`},
})

const generateMemberSubs = ({email_address}: SubscriptionBody):Member => ({
  email_address,
  status: 'subscribed'
})

export const run = asyncMiddleware(
  async(event) => {
    let body = JSON.parse(event.body as string);
    
    if (!body || !body.email_address) throw new BadRequest('Email is required')
    
    if(!isOffline && isProd){ //We only want to make a request to apichimp if we're in prod

      const memberBody = {members: [generateMemberSubs(body)]};
      await serviceInstance.post(`/lists/${listId}`, memberBody)
    }
    return { // Don't catch other service errors - otherwise anyone will know an email
      statusCode: 200,
      body: JSON.stringify(successMessage),
      headers: { 'Access-Control-Allow-Origin': '*'},
    }
  }
)