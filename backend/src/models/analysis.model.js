const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema(
  {
    repositoryUrl: {
      type: String,
      required: true,
      trim: true
    },

    repositoryName: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

const Analysis = mongoose.model('Analysis', analysisSchema);

module.exports = Analysis;