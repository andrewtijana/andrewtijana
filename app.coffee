express = require 'express'
mongoAdmin = require './lib/coffee/mongoAdmin'
config = require './lib/coffee/config.json'

app = express()

app.configure ->
	app.set 'views', __dirname + '/views'
	app.set 'view engine', 'jade'
	app.set 'title', config.title
	app.use express.bodyParser()
	app.use express.cookieParser()
	app.use express.static(__dirname + '/public')

app.configure 'development', ->
	app.use express.errorHandler({dumpExceptions:true})
	app.set 'view options', {pretty:true}

app.configure 'production', ->
	app.use express.errorHandler({dumpExceptions:ture})

app.get '/', (req, res)->
	res.redirect '/home'
	
app.get '/home', (req, res)->
	res.render 'home'

app.get '/details', (req, res)->
	res.render 'details'

app.get '/venue', (req, res)->
	res.render 'venue'
	
app.get '/ourpics', (req, res)->
	res.render 'ourpics'
	
app.get '/rsvp', (req, res)->
	res.render 'rsvp'
	
app.get '/venue', (req, res)->
	res.render 'venue'
	
app.get '/registry', (req, res)->
	res.render 'registry'
	
app.get '/kwsites', (req, res)->
	res.render 'kwsites'
	
app.post '/commitGuest', (req, res)->
	guests = req.body.guests
	if guests?
		mongoAdmin.addFam guests[0], guests[1], guests[2], (famID)->
			console.log 'famID' + famID
			if famID? and famID.indexOf('ERROR:') isnt -1
				console.log 'could not add the family'
				res.send 'Oops there was an error! Please try again.'
			else
				for guest in guests[3]
					if guests[2] is 'no'
						mongoAdmin.addGuest famID, guest[0], guest[1], (result)->
							if result?
								console.log 'could not add not attending guest; err: ' + result
								res.send 'Oops there was an error! Please try again.'
							else
								res.send 'Thank you for responding! Feel free to continue browsing our wedding websites :)'
					else
						mongoAdmin.addGuest famID, guest[0], guest[1], guest[2], guest[3], (result)->
							if result?
								console.log 'could not add attending guest; err: ' + result
								res.send 'Oops there was an error! Please try again.'
							else
								res.send 'Thank you for responding! Feel free to continue browsing our wedding websites :)'
	else
		console.log 'guests variable is empty'
		res.send 'Oops there was an error! Please try again.'

port = process.env.PORT || 5000
app.listen port