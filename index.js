require('newrelic');
var twilio     = require('twilio');
var express    = require('express');
var mongoose   = require('mongoose');
var xml        = require('xml');
var bodyParser = require('body-parser');

var app        = express();
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.set('port', process.env.PORT || 3000);

/**
 * MongoDB Stuffs
 */

var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost/confessions';

mongoose.connect( mongoUri );
var Confession = mongoose.model('Confession', {
    recording_url : String,
    from          : String,
    votes         : Number
});

var twiml = new twilio.TwimlResponse();

app.get('/receivecall', function (req, res) {
    twiml.say('BUTTS!');
    res.set('Content-Type', 'text/xml');
    res.send('<?xml version="1.0" encoding="UTF-8"?><Response><Say>For all have sinned, and come short of the glory of God! Leave your confession after the beep</Say><Record action="/record" method="POST" maxLength="10" finishOnKey="*"/><Say>I did not receive your confession</Say></Response>');
});

app.post('/record', function (req, res) {
    console.log( req.body );
    console.log( req.body.RecordingUrl );
    console.log( req.body.Caller );

    var confession = new Confession ({
        recording_url : req.body.RecordingUrl,
        from          : req.body.from,
        votes         : 0
    });
    confession.save( function (err) {
        console.log('Saved confession to DB');
    });

    // Send hangup response
    res.set('Content-Type', 'text/xml');
    res.send('<?xml version="1.0" encoding="UTF-8"?><Response><Hangup/></Response>');
});

app.get('/', function (req, res) {

    var confessionsArray = [];
    Confession.find( function(err, confessions) {
        if (err) return console.log(err);
        console.log(confessions);

        confessions.forEach( function(confession) {
            confessionsArray.unshift({
                recording_url : confession.recording_url,
                from          : confession.from,
                votes         : confession.votes
            });
        });

        res.render('index', {
            recordings: confessionsArray
        });

    });

});

var server = app.listen(app.get('port'), function () {
    console.log( 'App running on port:' + app.get('port') );
});
