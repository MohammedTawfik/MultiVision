var express = require('express'),
  stylus = require('stylus'),
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose')
  
//noinspection JSUnresolvedVariable
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

function complie(str,path)
{
    return stylus(str).set('filename',path);
}

app.set('view engine', 'jade');
app.set('views', './server/views');

app.use(logger('dev'));
app.use(bodyParser());
app.use(stylus.middleware(
  {
    src: './public',
    compile: complie
  }
));
app.use(express.static(__dirname + '/public'));

app.get('/partials/:partialPath', function(req, res) {
    res.render('partials/' + req.params.partialPath);
});


mongoose.connect('mongodb://localhost/multivision');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error...'));
db.once('open', function callback() {
    console.log('multivision db opened');
});

var messageSchema = mongoose.Schema({message : String});
var messageModel = mongoose.model('messages',messageSchema);
var messageResult;

messageModel.findOne().exec(function(err,messageDoc){

    messageResult = messageDoc.message;
});

app.get('*',function(req,res){
    res.render('index',{
        messageResult : messageResult
    });
});


var port = 3030;
app.listen(port);
console.log("Listening on port"+port);