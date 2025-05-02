import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient,GetCommand,QueryCommand,} from '@aws-sdk/lib-dynamodb';

const client = createDDbDocClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    console.log('Event:', JSON.stringify(event));

    const movieIdParam = event.pathParameters?.movieId;
    if (!movieIdParam) {
      return {
        statusCode: 400,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: "Path parameter 'movieId' is required" }),
      };
    }
    const movieId = Number(movieIdParam);

    const role = event.queryStringParameters?.role;

    if (role) {
      // partA
      const getResult = await client.send(
        new GetCommand({
          TableName: process.env.TABLE_NAME!,
          Key: { movieId, role },
        })
      );
      if (!getResult.Item) {
        return {
          statusCode: 404,
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ message: 'Crew member not found' }),
        };
      }
      return {
        statusCode: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(getResult.Item),
      };
    } else {
      // part b
      const queryResult = await client.send(
        new QueryCommand({
          TableName: process.env.TABLE_NAME!,
          KeyConditionExpression: 'movieId = :m',
          ExpressionAttributeValues: { ':m': movieId },
        })
      );
      if (!queryResult.Items || queryResult.Items.length === 0) {
        return {
          statusCode: 404,
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ message: 'Crew members not found' }),
        };
      }
      return {
        statusCode: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(queryResult.Items),
      };
    }
  } catch (err: any) {
    console.error('Error in handler:', err);
    return {
      statusCode: 500,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

function createDDbDocClient() {
  const ddbClient = new DynamoDBClient({ region: process.env.REGION });
  const marshallOptions = {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  };
  const unmarshallOptions = { wrapNumbers: false };
  return DynamoDBDocumentClient.from(ddbClient, { marshallOptions, unmarshallOptions });
}
