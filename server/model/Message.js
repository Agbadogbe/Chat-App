import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  username: String,
  message: String,
  room: String,
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
