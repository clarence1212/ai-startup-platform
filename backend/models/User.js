const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: false
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free'
    },
    stripeCustomerId: String,
    stripeSubscriptionId: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
