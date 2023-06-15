const express = require('express')
const router = express.Router()
const Message = require('../service/message')

// add msg
router.post('/', async (req, res) => {
    const newMessage = new Message(req.body)
    try {
        const savedMessage = await newMessage.save()
        res.status(200).json(savedMessage)
    } catch (error) {
        res.status(500).json(error)
    }
})

// get msgs
router.get('/:conversationId', async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId
        })
        res.status(200).json(messages)
    } catch (error) {
        res.status(500).json(error)
    }
})

// delete message
router.delete('/:messageId/:senderId', async (req, res) => {
    try {
        const { messageId, senderId } = req.params
        const result = await Message.deleteOne({ _id: messageId, sender: senderId })
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json(error)
        console.log(error);
    }
})


module.exports = router