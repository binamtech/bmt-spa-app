'use strict';

var Doc = require('mongoose').model('Doc');
	//DocPermission = require('./../constants').DocPermission;

var getErrorMessage = function (err) {
	var message = '';
	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Username already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) {
				message = err.errors[errName].message;
			}
		}
	}
	return message;
};

exports.create = function (req, res) {
	var user = req.authUser;
	var name = req.body.name;
	if (!name) {
		throw new Error('Document name is empty!');
	}
	//var contentType =	req.headers['Content-type'];
	var doc = new Doc({
		name: req.body.name,
		//todo add distinguish recognition between folders and files
		isFolder: req.body.isFolder,
		userCreated: user._id,
		userModified: user._id
	});
	if (req.catalog) {
		doc.parent = req.catalog;
	}

	//todo if isNew check for the file in the same folder
	doc.save(function (err) {
		if (err) {
			var message = getErrorMessage(err);
			return res.status(500).json({ success: false, message: message });
		} else {
			if (doc.isFolder) {
				res.json({ success: true, doc: doc });
			} else {
				res.json({ success: true, catalog: doc });
			}
		}
	});
};

var _listFn = null;

exports.list = function (req, res) {

	if (!_listFn) {
		_listFn = function(err, items) {
			if (err) {
				var message = getErrorMessage(err);
				return res.status(500).json({ success: false, message: message });
			} else {
				res.json({ success: true, result: items });
			}
		};
	}

	if (req.catalog) {
		req.catalog.getChildren(_listFn);
	} else {
		Doc.find({
			parent: null
		}, _listFn);
	}
};

exports.read = function (req, res) {
	//res.json(req.user);
	res.json({
		success: true
	});
};

exports.catalogByID = function (req, res, next) {
	if (req.params.catalogId) {
		Doc.findOne({
			_id: req.params.catalogId,
			isFolder: true
		}, function (err, catalog) {
			if (err) {
				return next(err);
			} else {
				req.catalog = catalog;
				next();
			}
		});
	}
};
exports.docByID = function (req, res, next) {
	if (req.params.docId) {
		Doc.findOne({
			_id: req.params.docId,
			isFolder: true
		}, function (err, doc) {
			if (err) {
				return next(err);
			} else {
				req.doc = doc;
				next();
			}
		});
	}
};

exports.update = function (req, res) {
	res.json({
		success: true
	});
};

exports.delete = function (req, res) {
	res.json({
		success: true
	});
};
