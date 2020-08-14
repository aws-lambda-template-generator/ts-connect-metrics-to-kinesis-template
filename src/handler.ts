import * as AWS from 'aws-sdk';
import { QueueServices } from './services/QueueServices';
import { MetricServices } from './services/MetricServices';
import { KinesisServices } from './services/KinesisServices';
import { INSTANCE_ID } from './constants';

AWS.config.update({
  region: 'ap-southeast-2'
});

const connect = new AWS.Connect();
const kinesisName = `connect-metrics-stream-${process.env.ENV}`;
let nextToken = '';

module.exports.connectDataIngest = async(event, context, callback) => {

  const queueServices = new QueueServices(connect, INSTANCE_ID);
  const metricServices = new MetricServices(connect, INSTANCE_ID, queueServices);
  const kinesisServices = new KinesisServices(kinesisName);

  while(nextToken != null) {
    try {
      const metrics = await metricServices.getCurrentMetricData(nextToken);
      nextToken = metrics.NextToken;
      console.log('Current Metrics: ', metrics);
      const kinesisPutResponse = await kinesisServices.putRecordToKinesis(metrics);
      console.log('Record successfuly put to Kinesis: ', kinesisPutResponse);

    } catch (e) {
      console.error('Error in putting metrics records to kinesks: ', e);
    }
  }

  callback(null, null);
};