import Joi = require("joi");

export interface ILabelMatch {
  missingLabel: string;
  regex: string;
}

export interface IConfig {
  requiredLabels?: ILabelMatch[];
}

//
// requiredLabels:
// - missingLabel: needs-area
//   regex: area:.*
// - missingLabel: needs-type
//   reqex: type:.*
export const schema = Joi.object().keys({
  requiredLabels: Joi.array().items(
    Joi.object().keys({
      missingLabel: Joi.string(),
      regex: Joi.string(),
    }),
  ),
});
