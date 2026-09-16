const validateRequiredFields = (fields) => {
  return (req, res, next) => {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: `Request body is missing. Please provide a JSON body with: ${fields.join(', ')}`,
      });
    }

    const missingFields = [];
    for (const field of fields) {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    next();
  };
};

module.exports = { validateRequiredFields };
