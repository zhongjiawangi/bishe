const joi = require('joi')

const address = joi.string().required()

const houseid = joi.number().required()

const newMasterId = joi.number().required()

const oldMasterId = joi.number().required()

exports.change_address_schema = {
  body: {
    address,
    houseid
  }
}

exports.change_master_schema = {
  query: {
    newMasterId: houseid,
    oldMasterId: joi.not(joi.ref('newMasterId')).concat(newMasterId),
    houseid
  }
}