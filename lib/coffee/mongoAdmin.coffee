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
			addedGuest errDB, null

getFamilies = (families) ->
	connectDB (errDB, db) ->
		if db?
			collection = db.collection 'Family'
			collection.find({},{'sort':['attending','desc']}).toArray (err, familiesArray) ->
				db?.close()
				families null, familiesArray
		else
			families "There was a problem connecting to the database", null
				
getGuests = (email, guests) ->
	connectDB (errDB, db) ->
		if db?
			collection = db.collection 'Guests'
			collection.find({'familyID':email}).toArray (err, guestsArray) ->
				db?.close()
				guests null, guestsArray
		else
			guests "There was a problem connecting to the database", null
			
exports.getReport = (report) -> 
	reportDetails = []
	numGuests = 0
	meal1 = 0
	meal2 = 0
	meal3 = 0
	meal4 = 0
	
	getFamilies (err, families)->
		if err?
			report err, null, null
			return
		for family in families
			guestsResult = getGuests family.email, (errG,guests)->
				if errG?
					report errG, null, null
					return
				numGuests += guests.length
				guestsArr = []
				for guest in guests
					if guest.meal is 'Chicken'
						meal1++
					else if guest.meal is 'Vegetarian'
						meal2++
					else if guest.meal is 'Kids < 5yrs'
						meal3++
					else if guest.meal is 'Kids 5-12yrs'
						meal4++
					guestArr = 
						fname:guest.fname
						lname:guest.lname
						meal:guest.meal
						restriction:guest.restriction
					guestsArr.push guestArr
				return [family.email, guestsArr]
			console.log JSON.stringify(guestsResult)
			reportDetails.push guestsResult
			if(reportDetails.length is families.length)
				report null, reportDetails, ['numGuests':numGuests,'meal1':meal1,'meal2':meal2,'meal3':meal3,'meal4':meal4]
				return
		
if not module.parent
	exports.getReport (err, report, details)->
		console.log JSON.stringify(report)