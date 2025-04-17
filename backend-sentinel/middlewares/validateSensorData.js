// Middleware to validate incoming sensor data payload
// Ensures all required fields are present and timestamp is in valid ISO 8601 format


const validateSensorData = (req, res, next) => {
  const { device_id, timestamp, sensors } = req.body;

  const missingFields = [];

  // Check for top-level required fields
  if (!device_id) missingFields.push('device_id');
  if (!timestamp) missingFields.push('timestamp');
  if (!sensors) {
    missingFields.push('sensors');
  } else {
    // Check nested sensor fields
    if (sensors.temperature === undefined) missingFields.push('sensors.temperature');
    if (sensors.humidity === undefined) missingFields.push('sensors.humidity');

    // Validate gas object
    if (!sensors.gas || sensors.gas.co2 === undefined || sensors.gas.co === undefined) {
      missingFields.push('sensors.gas.co2', 'sensors.gas.co');
    }

    // Validate acceleration object
    if (
      !sensors.acceleration ||
      sensors.acceleration.x === undefined ||
      sensors.acceleration.y === undefined ||
      sensors.acceleration.z === undefined
    ) {
      missingFields.push('sensors.acceleration.x', 'sensors.acceleration.y', 'sensors.acceleration.z');
    }

    // Check remaining sensor fields
    if (sensors.heart_rate === undefined) missingFields.push('sensors.heart_rate');
    if (sensors.noise_level === undefined) missingFields.push('sensors.noise_level');
    if (sensors.battery === undefined) missingFields.push('sensors.battery');
  }

  // If any fields are missing, return a 400 Bad Request
  if (missingFields.length > 0) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Missing required fields',
      missing: missingFields
    });
  }

  // Validate timestamp format (basic ISO 8601 check)
  if (isNaN(Date.parse(timestamp))) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Invalid timestamp format. Expected ISO 8601.'
    });
  }

  // If all checks pass, continue to the next middleware
  next();
};

export default validateSensorData;
