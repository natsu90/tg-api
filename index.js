var express = require('express')
var app = express()

var SimpleTelegram = require('simple-telegram')
var stg = new SimpleTelegram()

// Replace next values to your own paths
var tgDir = process.env.TELEGRAM_HOME || process.env.OPENSHIFT_DATA_DIR+'/tg' || '/var/www/tg';
var tgBinFile  = tgDir+"/bin/telegram-cli"
var tgKeysFile = tgDir+"/tg-server.pub"

var rest = require('restler')

var bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Creating simpleTelegram object
stg.create(tgBinFile, tgKeysFile, '-W')

app.set('port', (process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 5000))
app.set('ip', (process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1"));
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.post('/api/v1/send', function(req, res) {
	
	if(typeof process.env.API_KEY != 'undefined' && req.param.api_key != process.env.API_KEY)
		return res.send('Not authorized')
	stg.send(req.body.to, req.body.message)
	res.send('OK')
})

stg.getProcess().stdout.on("receivedMessage", function(msg) {
    console.log("\nReceived message")
    console.dir(msg)
    if( typeof process.env.WEBHOOK != 'undefined')
    	rest.post(process.env.WEBHOOK, {data: {user: msg.caller, message: msg.content}})
})

app.listen(app.get('port'), app.get('ip'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
