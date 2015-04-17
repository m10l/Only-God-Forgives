var twilio     = require('twilio');
var twiml      = new twilio.TwimlResponse();
var express    = require('express');
var app        = express();
var xml        = require('xml');
var bodyParser = require('body-parser');
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'ejs');
app.use(express.static('public'));

var recordings = [];

app.get('/receivecall', function (req, res) {
    twiml.say('BUTTS!');
    res.set('Content-Type', 'text/xml');
    res.send('<?xml version="1.0" encoding="UTF-8"?><Response><Say>For all have sinned, and come short of the glory of God! Leave your confession after the beep</Say><Record action="/record" method="POST" maxLength="10" finishOnKey="*"/><Say>I did not receive your confession</Say></Response>');
});

app.post('/record', function (req, res) {
    console.log( req.body );
    console.log( req.body.RecordingUrl );
    console.log( req.body.Caller );

    recordings.push({
        recording_url : req.body.RecordingUrl,
        from          : req.body.from,
        votes         : 0
    });

    console.log(recordings);

    res.set('Content-Type', 'text/xml');
    res.send('<?xml version="1.0" encoding="UTF-8"?><Response><Hangup/></Response>');
});

app.get('/', function (req, res) {
    res.render('index', {
        recordings: recordings
    });
});

var server = app.listen(3000, function () {
    console.log('hiya');
});
