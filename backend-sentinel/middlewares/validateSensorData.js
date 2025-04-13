const validateSensorData = (req, res, next) => {
  const { device_id, timestamp, sensors } = req.body;
  if (!device_id || !timestamp || !sensors) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  next();
};

export default validateSensorData;
