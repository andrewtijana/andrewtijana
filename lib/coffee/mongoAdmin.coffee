config = require './config.json'
mongo = require('../../node_modules/mongo/node_modules/mongodb').MongoClient
dbURI = config.dbURI

connectDB = (dbConn) ->
	mongo.connect dbURI, (err,db) ->
		if err?
			console.log 'ERROR: unable to connect to the database'
			dbConn err, null
		dbConn null, db
	
exports.addFam = (email,attending,numGuests, famID) ->
	connectDB (errDB, db) ->
		if db?
			collection = db.collection 'Family'
			searchEmail = {'email':email}
			attendance = {'email':email,'attending':attending, 'numGuests':numGuests}
			collection.update searchEmail, attendance, {safe:true,upsert:true}, (errID, fam) ->
				db?.close()
				if errID?
					console.log 'ERROR: unable to add family with email: ' + email
					famID errID, null
				else
					famID null, JSON.stringify(fam)
		else
			db?.close
			famID errDB, null
			
exports.addGuest = (familyID, lname, fname, meal,restriction, addedGuest) ->
	connectDB (errDB, db) ->
		if db?
			guest = {'familyID':familyID,'lname':lname,'fname':fname}
			options = {'familyID':familyID,'lname':lname,'fname':fname,'meal':meal,'restriction':restriction}
			collection = db.collection 'Guests'
			collection.update guest, options, {safe:true,upsert:true}, (errGuest, numRecords) ->
				db?.close()
				if errGuest?
					console.log 'ERROR: unable to add the guest with fname: ' + fname + ' and lname: ' + lname
					addedGuest errGuest, null
				else
					addedGuest null, JSON.stringify(numRecords)
		else
			db?.close()
			addedGuest errDB, null