var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://bgaskwarrier:kaw009020@cluster0-1jamj.mongodb.net/ChatApp?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useUnifiedTopology: true }, { useNewUrlParser: true });
client.connect(err => {
	console.log("connected to mongodb");
	const collection = client.db("ChatApp").collection("Messages");
	// perform actions on the collection object
	client.close();
    });

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

var Message = mongoose.model('Message', {
	name: String,
	message: String
    });


app.get('/messages', (req, res) => {
	Message.find({}, (err, messages) => {
		res.send(messages);
	    });
    });

app.post('/messages', (req, res) => {
	var message = new Message(req.body);
	message.save().then(() => {
		io.emit('message', req.body);
                res.sendStatus(200);
	    })
	.catch((err) =>{
		res.sendStatus(500);
                return console.error(err);
	    });
    });

io.on('connection', (socket) => {
	console.log('a user connected');
    });

mongoose.connect(uri, {useMongoClient: true}, (err) => {
	console.log('mongo db connection', err);
    });

var server = http.listen(3000, () => {console.log('server is listening on port', server.address().port);});