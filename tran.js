const joi = require("joi");

const schema = joi.object({
  amount: joi.number().required().min(1).max(99999999),
});

const validate = async (tran) => {
  let result = null;
  try {
    await schema.validateAsync(tran);
  } catch (err) {
    result = err;
  }
  if (result != null) result = result.details[0].message;
  return result;
};

module.exports.validate = validate;
