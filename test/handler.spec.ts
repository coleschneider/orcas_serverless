
import { APIGatewayEvent, APIGatewayEventRequestContext } from "aws-lambda";
import { expect } from "chai";
import {run} from "../handler";

describe("Lambda Handler", () => {
  it("should handle error if email isn't present", async() => {
    const event = {body: JSON.stringify({})} as APIGatewayEvent;
    const context = {} as APIGatewayEventRequestContext;
    const result = await run(event,context);
    expect(result.statusCode).to.equal(400)
    expect(JSON.parse(result.body)).to.equals('Email is required')
  });
});