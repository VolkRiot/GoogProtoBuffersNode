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

const postMessage = () => {
  const newContent = {
    text: 'HIHI',
    lang: 'French',
    ages: [69],
    nickName: 'Mike'
  };

  const msg = new Message({ text: 'yo', lang: 'slang', nickName: 'Mike' });
  // msg.setText(newContent.text).setLang(newContent.lang);

  axios
    .post('http://localhost:8081/api/messages', msg.toArrayBuffer(), {
      responseType: 'arraybuffer',
      headers: { 'Content-Type': 'application/octet-stream' }
    })
    .then(response => {
      console.log('Response from the server POST is ', response);
      const msg = Message.decode(response.data);
      console.log('Decoded POST message', msg);
      document.querySelector('#post-content').innerText = JSON.stringify(
        msg,
        null,
        2
      );
    })
    .catch(err => {
      console.log('Error returned is error ', err);
    });
};
