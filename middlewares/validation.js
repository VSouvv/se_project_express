const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateClothingItem = celebrate({
  body: Joi.object().keys({
    weather: Joi.string().valid("hot", "warm", "cold").required(),
    name: Joi.string().min(2).max(30).required().messages({
      "string.empty": "Item name is required",
      "string.min": "Item name must be at least 2 characters",
      "string.max": "Item name cannot be longer than 30 characters",
    }),

    imageUrl: Joi.string()
      .required()

      .custom(validateURL)
      .messages({
        "string.empty": 'The "imageUrl" field must be filled in',
        "string.uri": 'The "imageUrl" field must be a valid url',
      }),
  }),
});

const validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": "User name must be at least 2 characters",
      "string.max": "User name cannot be lopnger than 30 characters",
    }),

    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": "The avatar field must be filled in",
      "string.uri": "The URL for avatar must be valid",
    }),

    email: Joi.string().required().email().messages({
      "string.empty": "Must enter email",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Must enter password",
    }),
  }),
});

const validateUserAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": "Must enter email",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Must enter password",
    }),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().length(24).hex().required().messages({
      "string.empty": "The ID field must be filled in",
      "string.length": " The ID must have 24 characters",
      "string.hex": "The ID must be a valid hexadecimal value",
    }),
  }),
});

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": "User name must be at least 2 characters",
      "string.max": "User name cannot be lopnger than 30 characters",
    }),

    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": "The avatar field must be filled in",
      "string.uri": "The URL for avatar must be valid",
    }),
  }),
});

module.exports = {
  validateClothingItem,
  validateUserInfo,
  validateUserAuthentication,
  validateId,
  validateURL,
  validateUserUpdate,
};
