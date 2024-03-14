# Twilio Flex Insights API - Serverless Wrapper

Simplify your interactions with the [Flex Insights API](https://www.twilio.com/docs/flex/developer/insights/api/general-usage) using [Twilio Serverless Functions](https://www.twilio.com/docs/serverless/functions-assets) to fetch data from your [Insights Reports](https://www.twilio.com/docs/flex/end-user-guide/insights#dashboards-and-reports).


## How does this work?
This creates a wrapper service around the Twilio Flex Insights API using Node.js. The complexity of interacting with the API will be handled by Twilio Serverless Functions, allowing for one final, secured endpoint to be used. This endpoint will return CSV data from Flex Insights. 


## Prerequisites
Credentials to interact with the Flex Insights API must be requested from **Twilio Support**. When submitting a ticket through the Twilio Console, provide the **email address** you would like to use as your username for authentication.

Install the [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart) and the [Serverless Toolkit](https://www.twilio.com/docs/labs/serverless-toolkit).

## Setup
1. Clone this repo to your local development environment
2. Install dependencies
3. Deploy the **Serverless Service**
```
cd serverless-flex-insights
npm install
twilio serverless:deploy
```

## Sample Request
After deploying your Service, you will get a URL for the `getReport` Function that looks like:
```
https://YOUR_DOMAIN_NAME.twil.io/getReport
```

Send a request to that endpoint with the following parameters to fetch data:
| Parameter | Description | Example | 
| --- | --- | --- |
| WorkspaceId | Flex Insights global environment identifier | `qx8vgewnj2hyemje8f6bkrkbyqk8psrf` |
| ReportId | Flex Insights report identifier | `12345` |
| StartDate | Date filte (YYY-MM-DD) | `2023-12-01` |
| EndDate | Date filter (YYYY-MM-DD) | `2023-12-02` |

Provide your **username** and **password** credentials as Basic Authentication.

Review the [Flex Insights API documentation](https://www.twilio.com/docs/flex/developer/insights/api/export-data#export-the-raw-report) for more instructions on how to get the `WorkspaceId` and `ReportId`.

### Example
```
curl -u 'USERNAME:PASSWORD' 'https://YOUR_DOMAIN_NAME.twil.io/getReport?WorkspaceId=qx8vgewnj2hyemje8f6bkrkbyqk8psrf&ReportId=12345&DateStart=2022-12-01&DateEnd=2023-12-02'
```

## Disclaimer
This software is to be considered "sample code", a Type B Deliverable, and is delivered "as-is" to the user. Twilio bears no responsibility to support the use or implementation of this software.