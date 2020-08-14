import * as AWS from 'aws-sdk';
import { IQueueList, IQueue } from '../types';

export interface IQueueServices {
  getAllQueueId: () =>  Promise<string[]>;
}

export class QueueServices implements IQueueServices {

  private readonly _connect: AWS.Connect;
  private readonly _instanceId: string;

  constructor(connect: AWS.Connect, instanceId: string) {
    this._connect = connect;
    this._instanceId = instanceId;
  }

  getAllQueueId = async(): Promise<string[]> => {
    let finalArray = [];
    let nextToken = 'start';
    while(nextToken !== null) {
      if (nextToken === 'start') {
        const data = await this.getQueueData({InstanceId: this._instanceId }) as IQueueList;
        nextToken = data.NextToken;
        console.log('checking nextToken ', nextToken);
        finalArray = [].concat(finalArray, data.QueueSummaryList as any);
      } else {
        const data = await this.getQueueData({InstanceId: this._instanceId, NextToken: nextToken}) as IQueueList;
        nextToken = data.NextToken;
        console.log('checking nextToken ', nextToken);
        finalArray = [].concat(finalArray, data.QueueSummaryList as any);
      }
    }
    // console.log(finalArray);
    return (finalArray as IQueue[]).filter(x => x.Name !== null).map(x => x.Id);
  }

  private getQueueData = async(params: AWS.Connect.ListQueuesRequest): Promise<IQueueList> => {
    return new Promise((resolve, reject) => {
      this._connect.listQueues(params, (err, data) => {
        if (err) {
          reject(err);
          console.error(err);
        }
        resolve(data as IQueueList);
      });
    });
  }
}