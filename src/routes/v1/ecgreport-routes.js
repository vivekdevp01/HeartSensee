const express = require("express");
const router = express.Router();
const { EcgReportController } = require("../../controllers");
const { AuthMiddleware } = require("../../middlewares");
/**
 * @swagger
 * tags:
 *   name: ECG Reports
 *   description: APIs for managing patient ECG reports
 */

/**
 * @swagger
 * /ecgreports:
 *   post:
 *     summary: Create a new ECG report
 *     tags: [ECG Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - readingId
 *             properties:
 *               readingId:
 *                 type: string
 *                 description: ID of the ECG reading
 *                 example: 65123abc456def789012gh34
 *     responses:
 *       201:
 *         description: ECG report created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  AuthMiddleware.isLoggedIn,
  AuthMiddleware.requirePatient,
  EcgReportController.createEcgReport
);
/**
 * @swagger
 * /ecgreports/{reportId}:
 *   get:
 *     summary: Get a single ECG report by ID
 *     tags: [ECG Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ECG report ID
 *     responses:
 *       200:
 *         description: ECG report details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Report not found
 */
router.get(
  "/:reportId",
  AuthMiddleware.isLoggedIn,
  EcgReportController.getSingleReport
);
/**
 * @swagger
 * /ecgreports:
 *   get:
 *     summary: Get all ECG reports for the logged-in patient
 *     tags: [ECG Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of patient ECG reports
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/",
  AuthMiddleware.isLoggedIn,
  AuthMiddleware.requirePatient,
  EcgReportController.getPatientReports
);
/**
 * @swagger
 * /ecgreports/download:
 *   post:
 *     summary: Download multiple ECG reports (e.g., as PDF/ZIP)
 *     tags: [ECG Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reportIds
 *             properties:
 *               reportIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["65123abc456def789012gh34", "78901klm234nop567890qr12"]
 *     responses:
 *       200:
 *         description: Download link or file stream returned
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: One or more reports not found
 */
router.post(
  "/download",
  AuthMiddleware.isLoggedIn,
  AuthMiddleware.requirePatient,
  EcgReportController.downloadReports
);
module.exports = router;
