config = require './config.json'
mongo = require('../../node_modules/mongo/node_modules/mongodb').MongoClient
dbURI = config.dbURI

exports.connectDB = (dbConn) ->
	mongo.connect dbURI, (err,db) ->
		if err?
			console.log 'ERROR: unable to connect to the database'
			dbConn null
		console.log err
		dbConn db
	
exports.addFam = (email,attending,numGuests, famID) ->
	connectDB (db) ->
		if db?
			collection = db.collection('Family')
			family = {'email':email, 'attending':attending, 'numGuests':numGuests}
			collection.insert family, {safe:true}, (err, result) ->
				if err?
					db.close()
					console.log 'ERROR: unable to add family with email: ' + email
					famID err
				else
					famID result._id
		else
			famID db
			
exports.addGuest = (familyID, lname, fname, meal,restriction, added) ->
	connectDB (db) ->
		if db?
			guest = {'fname':fname,'lname':lname,'familyID':ObjectID.createFromHexString(familyID),'meal':meal,'restriction':restriction}
			collection = db.collection('Guests')
			collection.insert guest, {safe:true}, (err, result) ->
				db.close()
				if err?
					console.log 'ERROR: unable to add the guest with fname: ' + fname + ' and lname: ' + lname
					added err
				added result._id	
			else
				added db