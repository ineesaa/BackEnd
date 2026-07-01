const mongoose = require('mongoose');
const { Types } = require('mongoose').Schema;
const materialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: String,
    type: {
      type: String,
      enum: ['video', 'pdf', 'link'],
      default: 'link',
    },
  },
  { _id: false },
);
const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: Types.String,
    materials: [materialSchema],

    // Reference
    teacher: {
      type: Types.ObjectId,
      ref: 'User', // <- model name
      required: true,
    },

    capacity: {
      type: 'Number',
      default: 20,
      min: 1,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Course', courseSchema);
