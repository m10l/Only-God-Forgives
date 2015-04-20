/**
 * Dependencies
 * ============
 */

var twilio     = require('twilio');
var express    = require('express');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');

/**
 * Express config
 * ==============
 */

var app = express();
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );
app.set( 'view engine', 'ejs' );
app.use( express.static('public') );
app.set( 'port', process.env.PORT || 3000 );

/**
 * MongoDB Config
 * ==============
 */

var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost/confessions';

mongoose.connect( mongoUri );
var Confession = mongoose.model('Confession', {
    recording_url : String,
    from          : String,
    votes         : Number
});

app.get('/receivecall', function (req, res) {
    res.set('Content-Type', 'text/xml');
    res.send('<?xml version="1.0" encoding="UTF-8"?><Response><Say>For all have sinned, and come short of the glory of God! Leave your confession after the beep</Say><Record action="/record" method="POST" maxLength="120" finishOnKey="*"/><Say>I did not receive your confession</Say></Response>');
});

app.post('/record', function (req, res) {

    var confession = new Confession ({
        recording_url : req.body.RecordingUrl,
        from          : req.body.Caller,
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
        var index = 0;
        confessions.forEach( function(confession) {
            index = index++;
            confessionsArray.unshift({
                recording_url : confession.recording_url,
                from          : confession.from,
                votes         : confession.votes,
                id            : index
            });
        });

        res.render('index', {
            recordings: confessionsArray
        });

        console.log(confessionsArray);

    });

});

var server = app.listen(app.get('port'), function () {
    console.log( 'App running on port:' + app.get('port') );
});
