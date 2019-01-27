const path = require('path');
const express = require('express');
let ProtoBuf = require('protobufjs');

const app = express();

let messages = [
  { text: 'hello', lang: 'english' },
  { text: 'hey', lang: 'American' },
  { text: 'yo', lang: 'hella-American' }
];

let builder = ProtoBuf.loadProtoFile(
  path.join(__dirname, 'public', 'message.proto')
);

const Message = builder.build('Message');

app.use(express.static('public'));

// Middleware to handle the Protobuff Array Buffer
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  if (!req.is('appication/octet-stream')) return next();

  let data = [];

  req.on('data', chunk => {
    data.push(chunk);
  });

  req.on('end', () => {
    if (data.length <= 0) return next();
    data = Buffer.concat(data); // Make one Large Buffer of it.
    console.log('Recieved buffer', data);
    req.raw = data;
    next();
  });
});

// Route to respond with Proto Api data
app.get('/api/messages', (req, res, next) => {
  // Returns random data from the Proto.
  const msg = new Message(messages[Math.round(Math.random() * 2)]);
  console.log('Encode and decode: ', Message.decode(msg.encode().toBuffer()));
  console.log('Buffer we are sending: ', msg.encode().toBuffer());
  res.send(msg.encode().toBuffer());
});

app.post('/api/messages', (req, res, next) => {
  if (req.row) {
    try {
      // Decode the meessage.
      let msg = Message.decode(req.row);
      console.log(`Recieved ${msg.text} in ${msg.lang}`);
    } catch (err) {
      console.log('Processing failed with: ', err);
      next(err);
    }
  } else {
    console.log('Not binary Data');
  }
});

app.all('*', (req, res) => {
  res.status(400).send('Not supported');
});

app.listen(8081);
