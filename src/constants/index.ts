export const INSTANCE_ID = process.env.ENV === 'prod'
  ? '<production amazon connect instance id>'
  : '<non production amazon connect instance id>';

  export const START_NEXT_TOKEN_FOR_METRICS = 'start';