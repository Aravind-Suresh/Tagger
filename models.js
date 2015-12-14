var mongoose = require("mongoose");

var Models = {};

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

Models.Thing = mongoose.model('Thing', new Schema({
	key: String,
	tags: [String]
}));

module.exports = Models;