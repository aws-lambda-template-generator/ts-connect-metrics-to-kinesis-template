import * as AWS from 'aws-sdk';
import { expect } from 'chai';
import { MetricServices } from '../src/services/MetricServices';
import { QueueServices } from '../src/services/QueueServices';
import { INT_TEST_INSTANCE_ID } from '../test-constants';

AWS.config.update({
  region: 'ap-southeast-2'
});

const connect = new AWS.Connect();
const instanceId = INT_TEST_INSTANCE_ID;

describe('MetricServices', () => {
  describe('getCurrentMetricData()', () => {
    it('should return metric data', async() => {
      // Arrange
      const queueServices = new QueueServices(connect, instanceId);
      const metricServices = new MetricServices(connect, instanceId, queueServices);

      // Act
      const metricData = await metricServices.getCurrentMetricData('');

      // Assert
      expect(metricData.MetricResults).not.null;
      expect(metricData.MetricResults).not.null;
      expect(metricData.DataSnapshotTime).not.null;

    });
  });
});