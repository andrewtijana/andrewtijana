express = require 'express'
mongoAdmin = require './lib/coffee/mongoAdmin'
config = require './lib/coffee/config.json'

app = express()

app.configure ->
	app.set 'views', __dirname + '/views'
	app.set 'view engine', 'jade'
	app.use express.bodyParser()
	app.use express.cookieParser()
	app.use express.static(__dirname + '/public')

app.configure 'development', ->
	app.use express.errorHandler({dumpExceptions:true})
	app.set 'view options', {pretty:true}

app.configure 'production', ->
	app.use express.errorHandler({dumpExceptions:ture})

app.get '/ourpics', (req, res)->
	console.log config.title
	res.render 'ourpics', {pageTitle:config.title}

port = process.env.PORT || 5000
app.listen port