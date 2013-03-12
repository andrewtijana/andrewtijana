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

app.get '/', (req, res)->
	res.redirect '/home'
	
app.get '/home', (req, res)->
	res.render 'home', {pageTitle:config.title}

app.get '/details', (req, res)->
	res.render 'details', {pageTitle:config.title}

app.get '/venue', (req, res)->
	res.render 'venue', {pageTitle:config.title}
	
app.get '/ourpics', (req, res)->
	res.render 'ourpics', {pageTitle:config.title}
	
app.get '/rsvp', (req, res)->
	res.render 'rsvp', {pageTitle:config.title}
	
app.get '/venue', (req, res)->
	res.render 'venue', {pageTitle:config.title}
	
app.get '/registry', (req, res)->
	res.render 'registry', {pageTitle:config.title}
	
app.get '/kwsites', (req, res)->
	res.render 'kwsites', {pageTitle:config.title}

port = process.env.PORT || 5000
app.listen port