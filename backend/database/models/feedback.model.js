const { Schema, model } = require("mongoose");
const { PLUTCHIK_EMOTIONS } = require('../../utils/plutchick');

const feedbackSchema = new Schema({
    formId: {
        type: String,
        required: true
    },
    emotion: {
        type: String,
        required: true,
        enum: Object.values(PLUTCHIK_EMOTIONS).map(e => e.name),
    },
    feedback: {
        type: String,
        required: true
    }
});

module.exports = model('feedbacks', feedbackSchema);
