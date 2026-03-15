const BadRequest = require("../errors/badRequestError");
const NotFound = require("../errors/notfound");
const { where } = require("../models/ecgreading");
const {
  EcgReadingRepository,
  UserRepository,
  EcgReportRepository,
} = require("../repositories");
const { publishAiJob } = require("../Jobs/aiJob");
const { sendEmailWithAttachment } = require("../utils/emailSender");
const { generateEcgReportPdf } = require("../utils/pdfGenerator");
const axios = require("axios");
const ecgReadingRepository = new EcgReadingRepository();
const userRepository = new UserRepository();
const ecgReportRepository = new EcgReportRepository();
// This is just a placeholder. Replace with real ML call or library
async function predictAbnormality(dataPoints) {
  try {
    const response = await axios.post("http://127.0.0.1:5000/predict", {
      ecg_signal: dataPoints,
    });

    const results = response.data.results;

    // Majority voting across beats
    const classCounts = {};
    results.forEach((r) => {
      classCounts[r.predicted_class] =
        (classCounts[r.predicted_class] || 0) + 1;
    });

    const finalClass = Object.keys(classCounts).reduce((a, b) =>
      classCounts[a] > classCounts[b] ? a : b
    );

    return {
      abnormalDetected: parseInt(finalClass) !== 0, // class 0 = Normal
      finalClass: parseInt(finalClass),
      classLabel:
        results.find((r) => r.predicted_class === parseInt(finalClass))
          ?.class_label || "Unknown",
      results,
    };
  } catch (err) {
    console.error("❌ Error calling Flask model:", err.message);
    throw new Error("ECG prediction failed");
  }
}
async function createReading(patientId, data) {
  try {
    if (!data.dataPoints || data.dataPoints.length === 0) {
      throw new BadRequest("ECG data points are required");
    }

    const patient = await userRepository.get(patientId);
    if (!patient) {
      throw new NotFound("Patient not found", patient);
    }

    const doctorId = patient.doctorId;
    let prediction = null;

    if (data.dataPoints && data.dataPoints.length > 0) {
      prediction = await predictAbnormality(data.dataPoints);
    }

    const ecgReading = await ecgReadingRepository.createEcgReading({
      patientId,
      doctorId,
      dataPoints: data.dataPoints,
      abnormalDetected: prediction ? prediction.abnormalDetected : false,
      predictedClass: prediction ? prediction.finalClass : null,
      classLabel: prediction ? prediction.classLabel : null,
      probabilities: prediction ? prediction.results : [],
    });

    const ecgReport = await ecgReportRepository.create({
      patientId,
      doctorId,
      status: prediction?.abnormalDetected ? "abnormal" : "normal",
      comments: prediction?.abnormalDetected
        ? `Abnormality detected: ${prediction.classLabel}`
        : "No abnormalities detected",
      predictedClass: prediction?.finalClass,
      classLabel: prediction?.classLabel,
      probabilities: prediction?.results,
      mongoReadingId: ecgReading._id.toString(),
      aiStatus: "pending",
    });
    try {
      await publishAiJob({
        reportId: ecgReport.id,
        patientId,
        doctorId,
        classLabel: ecgReport.classLabel, // ✅ added
        status: ecgReport.status,
        patientInfo: {
          age: patient.age,
          gender: patient.gender,
        },
      });
      console.log("✅ AI job published for report:", ecgReport.id);
    } catch (err) {
      console.error("❌ Error publishing AI job:", err.message);
    }

    // if (abnormalDetected) {
    //   const lastReadings = await ecgReadingRepository.getByPatient(
    //     patientId,
    //     3
    //   );
    //   if (lastReadings.filter((r) => r.abnormalDetected).length == 3) {
    //     console.log("SOS Triggered for patient:", patientId);
    //     await ecgReadingRepository.update(ecgReading._id, {
    //       sosTriggered: true,
    //     });
    //     // Generate PDF of recent reports
    //     const reports = await ecgReportRepository.getReportsByPatient(
    //       patientId
    //     );
    //     const pdfBuffer = await generateEcgReportPdf(patient, reports);

    //     // Send SOS email with PDF attached
    //     if (patient.email) {
    //       await sendEmailWithAttachment(
    //         patient.email,
    //         "🚨 SOS Alert - Continuous ECG Abnormalities",
    //         { ...patient, reports },
    //         null, // fromDate (optional)
    //         null, // toDate (optional)
    //         pdfBuffer
    //       );
    //     }
    //   }
    // }
    return { ecgReading, ecgReport };
  } catch (error) {
    console.error("Error creating ECG reading:", error);
    throw error;
  }
}
async function getPatientReadings(patientId, limit = 100) {
  try {
    const readings = await ecgReadingRepository.getByPatient(patientId, limit);
    return readings;
  } catch (error) {
    console.error("Error fetching ECG readings by patient:", error);
    throw error;
  }
}
async function getReadingsByDateRange(patientId, startDate, endDate) {
  if (!startDate) {
    throw new BadRequest("Start date is required");
  }

  const start = new Date(startDate);
  if (isNaN(start.getTime())) {
    throw new BadRequest("Invalid start date format");
  }

  let end;
  if (endDate) {
    end = new Date(endDate);
    if (isNaN(end.getTime())) {
      throw new BadRequest("Invalid end date format");
    }
  } else {
    end = new Date(); // default to today
  }
  try {
    const readings = await ecgReadingRepository.getByDateRange(
      patientId,
      start,
      end
    );
    return readings;
  } catch (error) {
    console.error("Error fetching ECG readings by date range:", error);
    throw error;
  }
}
async function getReadingById(id) {
  try {
    const reading = await ecgReadingRepository.getById(id);
    if (!reading) {
      throw new NotFound("ECG reading not found", reading);
    }
    return reading;
  } catch (error) {
    console.error("Error fetching ECG reading by ID:", error);
    throw error;
  }
}
async function getReadingsForDoctor(doctorId, limit = 100) {
  try {
    console.log("DoctorId in Service:", doctorId);
    const patients = await userRepository.findAll({
      where: { doctorId, role: "patient" },
      attributes: ["id", "firstName", "lastName", "email"],
    });
    console.log("Patients found:", patients);
    if (!patients || patients.length === 0) {
      return [];
    }
    const readingByPatient = {};
    for (const patient of patients) {
      const readings = await ecgReadingRepository.getByPatient(
        patient.id,
        limit
      );
      readingByPatient[patient.id] = {
        patient,
        readings,
      };
    }
    console.log("Readings by Patient:", readingByPatient);
    return readingByPatient;
  } catch (error) {
    console.error("Error fetching readings for doctor:", error);
    throw error;
  }
}
module.exports = {
  createReading,
  getPatientReadings,
  getReadingsByDateRange,
  getReadingById,
  getReadingsForDoctor,
};
