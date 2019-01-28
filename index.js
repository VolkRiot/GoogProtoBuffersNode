const path = require('path');
const express = require('express');
let ProtoBuf = require('protobufjs');

const app = express();
app.use(express.static('public'));

let messages = [
  { text: 'hello', lang: 'english', ages: [32, 32], nickName: 'Misha' },
  { text: 'hey', lang: 'American', ages: [32, 32] },
  { text: 'yo', lang: 'hella-American', ages: [32, 32], nickName: 'Misha' }
];

let builder = ProtoBuf.loadProtoFile(
  path.join(__dirname, 'public', 'message.proto')
);

const Message = builder.build('Message');

// Middleware to handle the Protobuff Array Buffer
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  if (!req.is('application/octet-stream')) {
    console.log(
      'Request is not of type appication/octet-stream',
      req.headers['content-type']
    );
    return next();
  }

  let data = [];

  req.on('data', chunk => {
    data.push(chunk);
  });

  req.on('end', () => {
    if (data.length === 0) return next();
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
  if (req.raw) {
    try {
      // Decode the meessage.
      let msg = Message.decode(req.raw);
      console.log(`Recieved ${msg.text} in ${msg.lang}`);
      res.send(msg.encode().toBuffer());
    } catch (err) {
      console.log('Processing failed with: ', err);
      next(err);
    }
  } else {
    console.log('Not binary Data in post');
  }
});

app.all('*', (req, res) => {
  res.status(400).send('Not supported');
});

app.listen(8081);
