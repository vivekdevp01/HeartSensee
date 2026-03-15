const express = require("express");
const router = express.Router();
const { EcgReadingController } = require("../../controllers");
const { AuthMiddleware } = require("../../middlewares");
/**
 * @swagger
 * tags:
 *   name: ECG Readings
 *   description: APIs for managing ECG readings
 */

/**
 * @swagger
 * /readings:
 *   post:
 *     summary: Create a new ECG reading
 *     tags: [ECG Readings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - data
 *             properties:
 *               data:
 *                 type: string
 *                 description: Raw ECG data or reference
 *                 example: "base64EncodedECGDataOrFilePath"
 *     responses:
 *       201:
 *         description: ECG reading created successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  AuthMiddleware.isLoggedIn,
  AuthMiddleware.requirePatient,
  EcgReadingController.createEcgReading
);
/**
 * @swagger
 * /readings:
 *   get:
 *     summary: Get all ECG readings for logged-in patient
 *     tags: [ECG Readings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of patient ECG readings
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/",
  AuthMiddleware.isLoggedIn,
  AuthMiddleware.requirePatient,
  EcgReadingController.getPatientReadings
);
/**
 * @swagger
 * /readings/date:
 *   get:
 *     summary: Get ECG readings for a patient within a date range
 *     tags: [ECG Readings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date

 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of ECG readings within the range
 *       400:
 *         description: Invalid dates
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/date",
  AuthMiddleware.isLoggedIn,
  AuthMiddleware.requirePatient,
  EcgReadingController.getReadingsByDateRange
);
/**
 * @swagger
 * /readings/doctor:
 *   get:
 *     summary: Get all patient ECG readings assigned to a doctor
 *     tags: [ECG Readings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of ECG readings for doctor’s patients
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/doctor",
  AuthMiddleware.isLoggedIn,
  AuthMiddleware.requireDoctor,
  EcgReadingController.getDoctorPatientReadings
);
/**
 * @swagger
 * /readings/{id}:
 *   get:
 *     summary: Get an ECG reading by ID
 *     tags: [ECG Readings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ECG reading ID
 *     responses:
 *       200:
 *         description: ECG reading details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Reading not found
 */
router.get(
  "/:id",
  AuthMiddleware.isLoggedIn,
  AuthMiddleware.requirePatient,
  EcgReadingController.getReadingById
);
module.exports = router;
