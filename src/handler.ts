import * as AWS from 'aws-sdk';
import { QueueServices } from './services/QueueServices';
import { MetricServices } from './services/MetricServices';
import { KinesisServices } from './services/KinesisServices';
import { INSTANCE_ID, START_NEXT_TOKEN_FOR_METRICS } from './constants';

AWS.config.update({
  region: 'ap-southeast-2'
});

const connect = new AWS.Connect();
const kinesisName = `connect-metrics-stream-${process.env.ENV}`;

module.exports.connectDataIngest = async(event, context, callback) => {

  const queueServices = new QueueServices(connect, INSTANCE_ID);
  const metricServices = new MetricServices(connect, INSTANCE_ID, queueServices);
  const kinesisServices = new KinesisServices(kinesisName);
  let nextToken = START_NEXT_TOKEN_FOR_METRICS;

  while(nextToken !== null) {
    try {
      const metrics = await metricServices.getCurrentMetricData(nextToken);
      nextToken = metrics.NextToken;
      console.log('Current Metrics: ', metrics);
      const kinesisPutResponse = await kinesisServices.putRecordToKinesis(metrics);
      console.log('Record successfuly put to Kinesis: ', kinesisPutResponse);

      // Alternatively, we can split the metric into small pecies per queue
      // For example, ingesting into splunk may truncate the data because of splunk event data size limit.
      // metrics.MetricResults.forEach(async(data, index) => {

      //   const eventDataToKinesis = {
      //     NextToken: metrics.NextToken,
      //     MetricResult: data,
      //     DataSnapshotTime: metrics.DataSnapshotTime
      //   };
      //   console.log(eventDataToKinesis);
      //   const kinesisPutResponse = await kinesisServices.putRecordToKinesis(eventDataToKinesis);
      //   console.log('Record successfuly put to Kinesis: ', kinesisPutResponse);
      // });

    } catch (e) {
      console.error('Error in putting metrics records to kinesks: ', e);
    }
  }

  callback(null, null);
};