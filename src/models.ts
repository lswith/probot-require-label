import Joi = require("joi");

export interface ILabelMatch {
  missingLabel: string;
  regex: string;
}

export interface IConfig {
  issues?: ILabelMatch[];
  pulls?: ILabelMatch[];
  // fallback supoprting backwards compatibility
  requiredLabels?: ILabelMatch[];
}

//
// issues:
// - missingLabel: needs-area
//   regex: area:.*
// - missingLabel: needs-type
//   reqex: type:.*
// pulls:
// - missingLabel: needs-area
//   regex: area:.*
// - missingLabel: needs-type
//   reqex: type:.*
export const schema = Joi.object().keys({
  issues: Joi.array().items(
    Joi.object().keys({
      missingLabel: Joi.string(),
      regex: Joi.string(),
    })
  ),
  pulls: Joi.array().items(
    Joi.object().keys({
      missingLabel: Joi.string(),
      regex: Joi.string(),
    })
  ),
  requiredLabels: Joi.array().items(
    Joi.object().keys({
      missingLabel: Joi.string(),
      regex: Joi.string(),
    })
  ),
});
