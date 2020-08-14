// For Queue Data
export interface IQueueList {
  QueueSummaryList: IQueue[];
  NextToken: string;
}

export interface IQueue {
  Id: string;
  Arn: string;
  Name: string | null;
  QueueType: string;
}

// For Metric Data
export interface IQueueData {
  Id: string;
  Arn: string;
}

export interface IDimensions {
  Queue: IQueueData;
  Channel: string;
}

export interface IMetric {
  Name: string;
  Unit: string;
}

export interface ICollection {
  Metric: IMetric;
  Value: number;
}

export interface IMetricResult {
  Dimensions: IDimensions;
  Collections: ICollection[];
}

// Root object model for Metric data
export interface ICurrentMetrics {
  NextToken?: any;
  MetricResults: IMetricResult[];
  DataSnapshotTime: Date;
}

// Get metric query parameter

export interface IGetMetricQueryParam {
  CurrentMetrics: ICurrentMetrics[];
  Filters: {
    Channel: string[];
    Queues: string;
  };
  Groupings: string[];
  InstanceId: string;
}

export interface ICurrentMetrics {
  Name: string;
  Unit: string;
}