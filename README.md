# Telegram CLI API Wrapper

A simple Telegram CLI API Wrapper to create your bot using your own mobile number.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and [Telegram CLI](https://github.com/vysheng/tg/) installed.

```sh
export TELEGRAM_HOME=/path/to/telegram/folder/

git clone https://github.com/natsu90/tg-api.git # or clone your own fork
cd tg-api
npm install
npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to OpenShift

[![DEPLOY TO OpenShift](http://launch-shifter.rhcloud.com/launch/DEPLOY TO.svg)](https://openshift.redhat.com/app/console/application_type/custom?&cartridges[]=nodejs-0.10&initial_git_url=https://github.com/natsu90/tg-api.git&name=telegram)

* SSH to your app; `ssh your-openshift-account-id@your-application-url` e.g `ssh 565fcf2c89f57576490001c1@telegram-namialus.rhcloud.com`
* Login for first time; `$TELEGRAM_HOME/bin/telegram-cli -k $TELEGRAM_HOME/tg-server.pub`
* Get your API key, `echo $OPENSHIFT_SECRET_TOKEN`, or set a new one, `export API_KEY=supersecret`
* Set your env variable; `export WEBHOOK=http://your.webhook.url`
* Restart

## Usage

- You would receive incoming message to your webhook URL with `from` & `message` parameter.

- You can reply to the message with `POST` `/api/v1/send?api_key=supersecret`, with parameter `to` (same as `from`) and `message`.