# ts-commect-metrics-to-kinesis-template

AWS Lambda Function to ingest contact centre metrics from Amazon Connect.

The function is triggered by CloudWatch scheduled event. It gets metric data from Amazon Connect and write it to a Kinesis stream. From the stream, we can use Firehose to push data to other places like 3rd party endpoints (Splunk, DataDog and so on) or S3 bucket.

It first retrieves the list of queues. Then, it get live metrics for all the queues and write to Kinesis.

## Prerequisite

This function requires to have:

- AWS Connect
- Kinesis Stream

## Tools and Framework

- Serverless
- Webpack
- Typescript
- Jenkins
- Mocha

# Get Started

## (1) Installation

```bash
# Install dependencies
npm i
```

# (2) Running integration tests

To run integration tests, AWS CLI needs to be configured with the right credentials. Then update test-constants with your connect instance id, kinesis stream name, and 

```bash
npm run integration
```

# (3) Deployment

We can either update Jenkinsfiles to run it in Jenkins or simply run it with serverless command.

```bash
# nonprod
sls deploy --stage nonprod # if you have serverless installed globally (npm i -g serverless)
npm run deploy -- --stage nonprod

# prod
sls deploy --stage prod
npm run deploy -- --stage prod
```

To remove, run the command below:

```bash
sls remove --stage nonprod
# or
npm run remove -- --stage nonprod
```

## How to Optimise Memory Allocation

Using AWS Lambda Power Tuning (see details [here](https://www.mydatahack.com/how-to-optimise-memory-allocation-for-lambda-functions/))

Note: do not run this with production function. It will mess with the data.

Input for the tuning

```json
{
  "lambdaARN": "<your lambda function ARN",
  "powerValues": [
    128,
    256,
    512,
    1024,
    2048,
    3008
  ],
  "num": 10,
  "payload": "{\"id\":\"cdc73f9d-aea9-11e3-9d5a-835b769c0d9c\",\"detail-type\":\"Scheduled Event\",\"source\":\"aws.events\",\"account\":\"123456789012\",\"time\":\"1970-01-01T00:00:00Z\",\"region\":\"ap-southeast-2\",\"resources\":[\"arn:aws:events:ap-southeast-2:123456789012:rule/ExampleRule\"],\"detail\":{}}",
  "parallelInvocation": true,
  "strategy": "balanced"
}
```