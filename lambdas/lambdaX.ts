

import { Handler } from "aws-lambda";

export const handler: Handler = async (event, context) => {
  try {
    
    console.log("Event: ", JSON.stringify(event));

    
    for (const record of event.Records) {
      
      const body = JSON.parse(record.body);
      console.log("Lambda X received SQS record:", body);

      
    }

    
  } catch (error: any) {
    
    console.error("Error in Lambda X:", error);
    throw new Error(JSON.stringify(error));
  }
};
