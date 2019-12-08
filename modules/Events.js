const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EventSchema = new Schema({
    name: {
        type: String
    },
    date: {
        type: Date
    }
})

module.exports = Event = mongoose.model('event', EventSchema)