import * as AWS from 'aws-sdk';

AWS.config.update({
  region: 'ap-southeast-2'
});

const kinesis = new AWS.Kinesis({
  apiVersion: '2013-12-02'
});

export class KinesisServices {

  private readonly _streamName: string;

  constructor(streamName: string) {
    this._streamName = streamName;
  }

  putRecordToKinesis = async(data): Promise<AWS.Kinesis.Types.PutRecordOutput> => {
    return new Promise((resolve, reject) => {
      kinesis.putRecord({
        Data: JSON.stringify(data),
        PartitionKey: 'metric-data-partition',
        StreamName: this._streamName
      }, (err, data) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        resolve(data);
      });
    });
  }
}
