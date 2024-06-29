const mongoose = require('mongoose');
const { PLUTCHIK_EMOTIONS } = require('../../utils/plutchick');
const { Schema } = mongoose;

const formResponseSchema = new Schema({
  formId: {
    type: Schema.Types.ObjectId,
    ref: 'Form',
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
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FormResponse', formResponseSchema);