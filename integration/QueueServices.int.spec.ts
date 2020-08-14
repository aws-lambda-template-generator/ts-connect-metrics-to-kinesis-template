import * as AWS from 'aws-sdk';
import { expect } from 'chai';
import { QueueServices } from '../src/services/QueueServices';
import { INT_TEST_INSTANCE_ID } from '../test-constants';

AWS.config.update({
  region: 'ap-southeast-2'
});

const connect = new AWS.Connect();
const instanceId = INT_TEST_INSTANCE_ID;

describe('QueueServices', () => {
  describe('getAllQueueId()', () => {
    it('should get all queue ids', async() => {
      // Arrange
      const queueServices = new QueueServices(connect, instanceId);

      // Act
      const queueIds = await queueServices.getAllQueueId();

      // Assert
      expect(queueIds.length > 1).to.be.true;

    });
  });
});