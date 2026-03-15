const mongoose = require("mongoose");

const ecgReadingSchema = new mongoose.Schema(
  {
    patientId: {
      type: Number, // reference to MySQL User.id
      required: [true, "Patient ID is required"],
      min: [1, "Patient ID must be a positive integer"],
    },
    doctorId: {
      type: Number, // optional doctor review
      min: [1, "Doctor ID must be a positive integer"],
    },
    dataPoints: {
      type: [Number], // array of ECG values
      required: [true, "ECG data points are required"],
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "ECG data points cannot be empty",
      },
    },
    recordedAt: {
      type: Date,
      default: Date.now,
    },
    abnormalDetected: {
      type: Boolean,
      default: false,
    },
    sosTriggered: {
      type: Boolean,
      default: false,
    },
    predictedClass: { type: Number },
    classLabel: { type: String },
    probabilities: { type: Array }, // store full results from Flask
  },
  { timestamps: true }
);
const EcgReading = mongoose.model("EcgReading", ecgReadingSchema);
module.exports = EcgReading;
