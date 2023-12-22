import express from 'express';
import Message from '../model/Message.js';

const router = express.Router();

router.post('/send', async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    await newMessage.save();
    res.status(201).send('Message sent');
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/:room', async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.room });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
