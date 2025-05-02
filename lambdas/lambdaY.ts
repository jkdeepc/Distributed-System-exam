

import { Handler } from "aws-lambda";

export const handler: Handler = async (event, context) => {
  try {
    
    console.log("Event: ", JSON.stringify(event));

    
    for (const record of event.Records) {
      
      const message = record.Sns.Message;
      console.log("Lambda Y received SNS message:", message);

      
    }

    
  } catch (error: any) {
    console.error("Error in Lambda Y:", error);
    
    throw new Error(JSON.stringify(error));
  }
};
