const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

exports.mongodbURI = function() {
	if (process.env.NODE_ENV === 'development') {
		return 'mongodb://192.168.1.6/cs341-prove-dev';
	}

	return 'mongodb+srv://tom:01dZgbm1iC79@cluster0.8b8rq.mongodb.net/cs341-prove?retryWrites=true&w=majority';
}

exports.mongoConnect = async function() {
	return MongoClient.connect(
		'mongodb://192.168.1.6'
	).then(client => {
		console.log('Connected!');
		if (process.env.NODE_ENV === 'development') {
			_db = client.db('cs341-prove-dev');
		} else {
			_db = client.db('cs341-prove');
		}
		return client;
	}).catch(err => {
		console.log(err);
		throw err;
	});
}

const getDB = () => {
	if (_db) {
		return _db;
	}

	throw 'No Database Found!';
}

exports.getDB = getDB;
