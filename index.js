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

app.set('port', (process.env.OPENSHIFT_NODEJS_PORT || 5000))
app.set('ip', (process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1"));
app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html')
})

var api_key = process.env.API_KEY || process.env.OPENSHIFT_SECRET_TOKEN || false;
app.post('/api/v1/send', function(req, res) {
	
	if(typeof req.query.api_key == 'undefined' || (api_key && req.query.api_key != api_key))
		return res.send(401, 'Not authorized')
	stg.send(req.body.to, req.body.message)
	res.send('OK')
})

app.post('/webhook_sample', function(req, res) {
	console.log('webhook sample', req.body, req.params)
	// http://www.businessinsider.my/programmer-automates-his-job-2015-11/
	if( ['help', 'trouble', 'sorry']
		.filter(function(str) { return req.body.message.toLowerCase().indexOf(str) > -1 }).length > 0 ) { console.log('sending reply');
		rest.post(process.env.OPENSHIFT_APP_DNS +'/api/v1/send?api_key='+ api_key, 
			{data: {to: req.body.from, message: 'No worries mate, be careful next time.'}});
	}
	res.send('OK')
})

stg.getProcess().stdout.on("receivedMessage", function(msg) {
    console.log("\nReceived message")
    console.dir(msg)
    if( typeof process.env.WEBHOOK !== 'undefined')
    	rest.post(process.env.WEBHOOK, {data: {from: msg.caller, message: msg.content}})
})

app.listen(app.get('port'), app.get('ip'), function() {
  console.log("Node app is running at "+ app.get('ip') +":" + app.get('port'))
})
