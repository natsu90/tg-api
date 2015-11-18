var express = require('express')
var app = express()

var SimpleTelegram = require('simple-telegram')
var stg = new SimpleTelegram()

// Replace next values to your own paths
var tgBinFile  = "/app/vendor/tg-1.0.5.1/bin/telegram-cli"
var tgKeysFile = "/app/vendor/tg-1.0.5.1/tg-server.pub"

var rest = require('restler');

// Creating simpleTelegram object
stg.create(tgBinFile, tgKeysFile)

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.post('/api/v1/send', function(req, res) {
	/*
	if(req.param.api_key == process.env.API_KEY)
		return res.send('Not authorized')
	*/
	console.log(req.body);
	stg.send(req.body.to, req.body.message)
	res.send('OK')
})

stg.getProcess().stdout.on("receivedMessage", function(msg) {
    console.log("\nReceived message")
    console.dir(msg)
    rest.post(process.env.WEBHOOK, {data: msg})
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
