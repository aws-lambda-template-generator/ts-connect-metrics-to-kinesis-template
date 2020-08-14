import { expect } from 'chai';
import { KinesisServices } from '../src/services/KinesisServices';
import { TEST_METRICS_DATA, INT_TEST_STREAM_NAME } from '../test-constants';

describe('KinesisServices', () => {
  describe('putRecordToKinesis()', () => {
    it('should successfully put record', async() => {
      // Arrange
      const kinesisServices = new KinesisServices(INT_TEST_STREAM_NAME);

      // Act
      const outcome  = await kinesisServices.putRecordToKinesis(TEST_METRICS_DATA);

      // Assert
      console.log(outcome);
      expect(outcome.ShardId).not.null;
      expect(outcome.SequenceNumber).not.null;
      expect(outcome.EncryptionType).not.null;
    });
  });
});