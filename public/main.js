'use strict';
let ProtoBuf = dcodeIO.ProtoBuf;
let Message;

ProtoBuf.loadProtoFile('message.proto', (err, builder) => {
  Message = builder.build('Message');
  console.log('Message is', new Message());
  // loadMessage();
});
