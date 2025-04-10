export const aggregateMessage = (query, select, cursor) => {
  const pipeline = [
    {
      $group: {
        _id: {
          $dateTrunc: {
            date: '$timestamp',
            unit: 'minute',
            binSize: 5
          }
        },
        sensorCode: { $first: '$sensorCode' },
        hum: { $avg: '$hum' },
        value: { $avg: '$value' }
      }
    },
    { $sort: cursor?.sort || { _id: -1 } },
    { $skip: cursor?.skip || 0 },
    { $limit: cursor?.limit || 100 }
  ];

  if (!_.isNil(select)) {
    pipeline.push({ $project: select });
  }

  return pipeline;
};
