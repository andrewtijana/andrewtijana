path = require 'path'

console.log 'path ' + path.join(path.dirname(require.main.filename), 'node_modules')

nodeModules = path.join(path.dirname(require.main.filename), 'node_modules')
config = require './config.json'
mongo = (require path.join(nodeModules, 'mongodb')).MongoClient
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
			addedGuest errDB, null

getFamilies = (families) ->
	connectDB (errDB, db) ->
		if db?
			collection = db.collection 'Family'
			collection.find({}).toArray (err, familiesArray) ->
				db?.close()
				families null, familiesArray
		else
			families "There was a problem connecting to the database", null

getGuests = (email, guests) ->
	connectDB (errDB, db) ->
		if db?
			collection = db.collection 'Guests'
			collection.find({'familyID':email}).toArray (err, guestsArray) ->
				numGuests = 0
				meal1 = 0
				meal2 = 0
				meal3 = 0
				meal4 = 0
				db?.close()
				if err?
					guests "Could not turn guests to array.", null, null
				numGuests += guestsArray.length
				guestsArr = []
				for guest in guestsArray
					if guest.meal is 'Caesar Salad'
						meal1++
					else if guest.meal is 'Cheddar/Cauliflower Soup'
						meal2++
					else if guest.meal is 'Kids < 5yrs'
						meal4++
					else if guest.meal is 'Kids 5-12yrs'
						meal3++
					guestArr =
						fname:guest.fname
						lname:guest.lname
						meal:guest.meal
						restriction:guest.restriction
					guestsArr.push guestArr
				details =
					'email':email
					'numGuests':numGuests
					'meal1':meal1
					'meal2':meal2
					'meal3':meal3
					'meal4':meal4
				guests null, guestsArr, details
		else
			guests "There was a problem connecting to the database", null

exports.getReport = (report) ->
	reportDetails = []
	detailsArr =
		'numGuests':0
		'meal1':0
		'meal2':0
		'meal3':0
		'meal4':0
	getFamilies (err, families)->
		if err?
			report err, null, null
			return
		for family in families
			guestsResult = getGuests family.email, (errG,guests, details)->
				detailsArr.numGuests += details.numGuests
				detailsArr.meal1 += details.meal1
				detailsArr.meal2 += details.meal2
				detailsArr.meal3 += details.meal3
				detailsArr.meal4 += details.meal4
				reportDetails.push [details.email,guests]
				if(reportDetails.length is families.length)
					report null, reportDetails,detailsArr
					return

if not module.parent
	exports.getReport (err, report, details)->
		console.log JSON.stringify(report)
		console.log JSON.stringify(details)
