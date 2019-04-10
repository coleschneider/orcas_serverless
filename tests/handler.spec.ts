import { APIGatewayEvent, Context } from 'aws-lambda';
import { expect } from 'chai';
import { run } from '../src/handler';
import { successMessage } from '../utils/asyncMiddleware';

describe('Subscribe Handler', () => {
  describe('[POST] Handler', () => {
    it("should handle error if body isn't present", async () => {
      const event = { body: null } as APIGatewayEvent;
      const context = {} as Context;
      const result = await run(event, context);
      expect(result.statusCode).to.equal(400);
      expect(JSON.parse(result.body)).to.deep.equal({ message: 'Email is required' });
    });
    it("should handle error if email isn't present", async () => {
      const event = { body: JSON.stringify({}) } as APIGatewayEvent;
      const context = {} as Context;
      const result = await run(event, context);
      expect(result.statusCode).to.equal(400);
      expect(JSON.parse(result.body)).to.deep.equal({ message: 'Email is required' });
    });
    it('should handle the success if an email is present', async () => {
      const event = { body: JSON.stringify({ email_address: 'testing@gmail.com' }) } as APIGatewayEvent;
      const context = {} as Context;
      const result = await run(event, context);
      expect(result.statusCode).to.equal(200);
      expect(JSON.parse(result.body)).to.deep.equal(successMessage);
    });
  });
});
