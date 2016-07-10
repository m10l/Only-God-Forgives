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
    votes         : Number,
    updated       : { type: Date, default: Date.now }
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

app.get('/api/all', function( req, res ) {

    var confessionsArray = [];
    Confession.find( function(err, confessions) {

        if (err) {
            console.log(err);
        }

        confessions.forEach( function(confession, index) {
            confessionsArray.unshift({
                recording_url : confession.recording_url,
                from          : confession.from,
                votes         : confession.votes,
                id            : confession._id
            });
        });

        res.json(confessionsArray);

    });

})

app.get('/', function (req, res) {

    var confessionsArray = [];
    Confession.find( function(err, confessions) {

        if (err) {
            console.log(err);
        }

        confessions.forEach( function(confession, index) {
            confessionsArray.unshift({
                recording_url : confession.recording_url,
                from          : confession.from,
                votes         : confession.votes,
                id            : confession._id
            });
        });

        res.render('index', {
            recordings: confessionsArray
        });

    });

});

app.post('/confessions/:id/vote', function (req, res) {

    Confession.findById( req.params.id, function (err, confession) {

        if ( req.body.vote_type === 'up' ) {
            confession.votes = confession.votes + 1
        } else if ( req.body.vote_type === 'down' ) {
            confession.votes = confession.votes - 1
        }

        confession.save( function (err) {
            console.log('Updated vote count on confession');
        });

    });

    res.send('Marked vote');

});

var server = app.listen(app.get('port'), function () {
    console.log( 'App running on port:' + app.get('port') );
});
