'use strict';

let ProtoBuf = dcodeIO.ProtoBuf;
let Message;

ProtoBuf.loadProtoFile('message.proto', (err, builder) => {
  Message = builder.build('Message');
  console.log('Message is', new Message());
  loadMessage();
});

const loadMessage = () => {
  axios
    .get('http://localhost:8081/api/messages', { responseType: 'arraybuffer' })
    .then(response => {
      console.log('Response from the server is ', response);
      const msg = Message.decode(response.data);
      console.log('Decode message', msg);
      document.querySelector('#content').innerText = JSON.stringify(
        msg,
        null,
        2
      );
    })
    .catch(err => {
      console.log('Error returned is error ', err);
    });
};
