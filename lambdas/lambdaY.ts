import type { SNSEvent } from "aws-lambda";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient({ region: process.env.REGION });
const queueBUrl = process.env.QUEUE_B_URL!;

export const handler = async (event: SNSEvent): Promise<void> => {
  console.log("Event:", JSON.stringify(event));

  for (const record of event.Records) {
    
    const payload = JSON.parse(record.Sns.Message);
    console.log("Lambda Y received SNS message:", payload);

    
    if (!payload.email) {
      console.log("No email field – forwarding to QueueB:", payload);
      await sqsClient.send(new SendMessageCommand({
        QueueUrl: queueBUrl,
        MessageBody: record.Sns.Message,
      }));
    } else {
      
      console.log("Has email, skipping QueueB");
    }
  }
};