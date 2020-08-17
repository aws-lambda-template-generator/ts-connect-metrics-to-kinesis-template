import * as AWS from 'aws-sdk';
import { IQueueServices } from './QueueServices';
import { ICurrentMetrics, IGetMetricQueryParam } from '../types';
import { START_NEXT_TOKEN_FOR_METRICS } from '../constants';

export class MetricServices {

  private readonly _connect: AWS.Connect;
  private readonly _instanceId: string;
  private readonly _queueServices: IQueueServices;

  constructor(connect: AWS.Connect, instanceId: string, queueServices: IQueueServices) {
    this._connect = connect;
    this._instanceId = instanceId;
    this._queueServices = queueServices;
  }

  getCurrentMetricData = async(nextToken): Promise<ICurrentMetrics> => {
    const params = await this.getMetricDataParam();

    if(nextToken !== START_NEXT_TOKEN_FOR_METRICS) {
      params['NextToken'] = nextToken;
      console.log('Getting more currentMetrics as suggested by NextToken: ', nextToken);
    } else {
      console.log('No more metrics record. NextToken: ', nextToken);
    }

    return new Promise((resolve, reject) => {
      this._connect.getCurrentMetricData(params, (err, data) => {
        if (err) console.error(err);
        resolve(data as ICurrentMetrics);
      });
    });
  }

  private getMetricDataParam = async() => {
    const queueIdArray = await this._queueServices.getAllQueueId();
    console.log('Queue Id Array: ', queueIdArray);
    return {
      CurrentMetrics: [
        {
          Name: 'AGENTS_AVAILABLE',
          Unit: 'COUNT'
        },
        {
          Name: 'AGENTS_ONLINE',
          Unit: 'COUNT'
        },
        {
          Name: 'CONTACTS_IN_QUEUE',
          Unit: 'COUNT'
        },
        {
          Name: 'OLDEST_CONTACT_AGE',
          Unit: 'SECONDS'
        }
      ],
      Filters: {
        Channels: [
          'VOICE',
          'CHAT'
        ],
        Queues: queueIdArray
      },
      Groupings: [
        'CHANNEL',
        'QUEUE'
      ],
      InstanceId: this._instanceId
    };
  }
}