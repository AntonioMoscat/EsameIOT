export async function syncSensor(doc, next) {
  try {
    logger.info('Syncing sensor from message');
    if (!_.isNil(doc.sensorCode)) {
      const existingSensor = await SensorModel.findOne({ name: doc.sensorCode });

      if (_.isNil(existingSensor)) {
        await SensorModel.create({
          name: doc.sensorCode,
        });
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}
