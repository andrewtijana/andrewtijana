config = require './config'
mongo = require('../../node_modules/mongo/node_modules/mongodb').MongoClient

dbURI = config.mongoWeddingURI
exports.connectDB = () ->
	mongo.connect dbURI, (err,db) ->
		if err?
			console.log 'ERROR: unable to connect to the database'
			return null

			return db
			
exports.closeDB = (db) ->
	db.close()
	
exports.addFam = (lname,fname,email) ->
	collection = db.collection('Family')
	family = {'lname':lname,'fname':fname,'email':email}
	collection.insert family, {w:1}, (err, result) ->
		if err?
			console.log 'ERROR: unable to connect to the database'
			return null
			
exports.addGuest = (fname, familyID, meal) ->
	guest = {'fname':fname,'familyID':familyID,'meal':meal}
	collection = db.collection('Guests')
	collection.insert guest, {w:1}, (err, result) ->
		if err?
			console.log 'ERROR: unable to connect to the database'
			return null	
			
exports.getFamID = (lname,fname) ->
	collection = db.collection('Family')
	collection.findOne {lname:lname,fname:fname},{_id:1}, (err,item) ->
		if err?
			console.log 'ERROR: unable to connect to the database'
			return null
		return item