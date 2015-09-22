express = require 'express'
errorHandler = require 'errorhandler'
bodyParser = require 'body-parser'
mongoAdmin = require './lib/coffee/mongoAdmin'
config = require './lib/coffee/config.json'
path = require 'path'

app = express()

app.set 'port', process.env.PORT || 3000
app.set 'views', path.join(__dirname, 'views')
app.set('view engine', 'jade');
app.use express.bodyParser.json()
app.use express.bodyParser.urlencoded({ extended: true })
app.use express.static(path.join(__dirname, 'public'))
app.set 'title', config.title


if 'development' == app.get('env')
	app.use express.errorHandler({dumpExceptions:true})
	app.set 'view options', {pretty:true}
else
	app.use express.errorHandler({dumpExceptions:true})

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

app.get '/tijanajovicoverview', (req, res)->
  res.render 'tijanajovicoverview'

app.get '/tijanajovicextras', (req, res)->
  res.render 'tijanajovicextras'

app.post '/commitGuest', (req, res)->
	guests = req.body.guests
	if guests?
		mongoAdmin.addFam guests[0], guests[1], guests[2], (err, numFamily)->
			if err?
				console.log "could not add the family"
				res.send "Oops there was an error! Please try again."
			else
				if guests[1] is 'no'
					mongoAdmin.addGuest guests[0], guests[3][0], guests[3][1], '', '', (errGuest, numRecord)->
						if errGuest?
							console.log "could not add guest that's not attending; err: " + errGuest
							res.send "Oops there was an error! Please try again."
						else
							res.send "Success!"
				else
					for guest in guests[3]
						mongoAdmin.addGuest guests[0], guest[0], guest[1], guest[2], guest[3], (errGuest, numRecord)->
							if errGuest?
								console.log "could not add attending guest; err: " + errGuest
								res.send "Oops there was an error! Please try again."
							else
								res.send "Success!"
	else
		console.log "guests variable is empty"
		res.send "Oops there was an error! Please try again."

app.get '/report', (req, res)->
	mongoAdmin.getReport (err, report, overview)->
		res.render 'report', {'report':report, 'overview':overview}

app.listen port
