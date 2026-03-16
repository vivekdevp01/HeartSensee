const express = require("express");
const router = express.Router();
const { PatientRequestController } = require("../../controllers");
const { AuthMiddleware } = require("../../middlewares");
/**
 * @swagger
 * /requests:
 *   post:
 *     summary: Create a patient request (e.g., consult a doctor)
 *     tags: [Patient Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctorId:
 *                 type: string
 *                 description: Doctor's ID
 *               message:
 *                 type: string
 *                 description: Request message
 *     responses:
 *       201:
 *         description: Patient request created successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  AuthMiddleware.isLoggedIn,
  AuthMiddleware.requirePatient,
  PatientRequestController.createRequest,
);
/**
 * @swagger
 * /requests/all:
 *   get:
 *     summary: Get all requests for the logged-in doctor
 *     tags: [Patient Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of patient requests
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/all",
  AuthMiddleware.isLoggedIn,
  AuthMiddleware.requireDoctor,
  PatientRequestController.getRequestsForDoctor,
);
/**
 * @swagger
 * /requests/{id}:
 *   get:
 *     summary: Get a specific patient request by ID
 *     tags: [Patient Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Patient request ID
 *     responses:
 *       200:
 *         description: Patient request details
 *       404:
 *         description: Request not found
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/:id",
  AuthMiddleware.isLoggedIn,
  AuthMiddleware.requireDoctor,
  PatientRequestController.getRequestById,
);
/**
 * @swagger
 * /requests/{id}/status:
 *   put:
 *     summary: Update the status of a patient request
 *     tags: [Patient Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Patient request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *     responses:
 *       200:
 *         description: Request status updated
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Request not found
 */
router.put(
  "/:id/status",
  AuthMiddleware.isLoggedIn,
  AuthMiddleware.requireDoctor,
  PatientRequestController.updateRequestStatus,
);
/**
 * @swagger
 * /requests/all/doctors:
 *   get:
 *     summary: Get all available doctors (for patients to choose from)
 *     tags: [Patient Requests]
 *     responses:
 *       200:
 *         description: List of doctors
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/all/doctors",
  AuthMiddleware.isLoggedIn,
  // AuthMiddleware.requirePatient,
  PatientRequestController.getAllDoctors,
);
module.exports = router;
