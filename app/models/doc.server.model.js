'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	tree = require('mongoose-path-tree'),
	DocPermission = require('./../constants').DocPermission;

var ObjectId = Schema.Types.ObjectId;

var PermissionDocSchema = new Schema({
	user: {
		type: ObjectId,
		ref: 'User'
	},
	permission: {
		type: Number,
		default: DocPermission.READ
	}
});

var DocSchema = new Schema({
	name: {
		type: String,
		required: 'Name is required'
	},
	isFolder: {
		type: Boolean,
		default: false
	},
	systemPath: String,
	sharedHash: String,
	created: {
		type: Date,
		default: Date.now
	},
	modified: {
		type: Date,
		default: Date.now
	},
	userCreated: {
		type: ObjectId,
		ref: 'User'
	},
	userModified: {
		type: ObjectId,
		ref: 'User'
	},
	children: [PermissionDocSchema]
});

DocSchema.plugin(tree,{
	pathSeparator: '#',      // Default path separator
	onDelete: 'DELETE',      // Can be set to 'DELETE' or 'REPARENT'. Default: 'REPARENT'
	numWorkers: 5,           // Number of stream workers
	idType: Schema.ObjectId  // Type used for _id. Can be, for example, String generated by shortid module
});

mongoose.model('Doc', DocSchema);