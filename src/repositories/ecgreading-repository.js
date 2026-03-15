const CrudRepository = require("./crud-repository");
const EcgReading = require("../models/ecgreading");
class EcgReadingRepository extends CrudRepository {
  constructor() {
    super(EcgReading);
  }
  async createEcgReading(data) {
    try {
      const ecgReading = await EcgReading.create(data);
      return ecgReading;
    } catch (error) {
      console.error("Error creating ECG reading:", error);
      throw error;
    }
  }
  async getByPatient(patientId, limit = 100) {
    try {
      const readings = await EcgReading.find({ patientId })
        .sort({ recordedAt: -1 })
        .limit(limit);
      return readings;
    } catch (error) {
      console.error("Error fetching ECG readings by patient:", error);
      throw error;
    }
  }
  async getByDateRange(patientId, startDate, endDate) {
    try {
      const readings = await EcgReading.find({
        patientId,
        recordedAt: {
          $gte: startDate,
          $lte: endDate,
        },
      }).sort({ recordedAt: -1 });
      return readings;
    } catch (error) {
      console.error("Error fetching ECG readings by date range:", error);
      throw error;
    }
  }
  async getById(id) {
    try {
      const reading = await EcgReading.findById(id);
      return reading;
    } catch (error) {
      console.error("Error fetching ECG reading by ID:", error);
      throw error;
    }
  }
  async update(id, updateData) {
    return await EcgReading.findByIdAndUpdate(id, updateData, { new: true });
  }
}
module.exports = EcgReadingRepository;
