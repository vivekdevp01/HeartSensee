const express = require("express");
const router = express.Router();
// const { DoctorController } = require("../../controllers");
const { AuthMiddleware, RoleCheck } = require("../../middlewares");
const { DoctorController } = require("../../controllers");
// const { AuthMiddleware, RoleCheck } = require("../../middlewares");

/**
 * @swagger
 * tags:
 *   name: Doctors
 *   description: Doctor profile management APIs
 */

/**
 * @swagger
 * /doctors:
 *   post:
 *     summary: Create a doctor profile
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - specialization
 *               - experience
 *             properties:
 *               specialization:
 *                 type: string
 *                 example: Cardiologist
 *               experience:
 *                 type: number
 *                 example: 10
 *               clinicName:
 *                 type: string
 *                 example: Apollo Hospital
 *     responses:
 *       201:
 *         description: Doctor profile created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  AuthMiddleware.isLoggedIn,
  RoleCheck.allowRoles("doctor"),
  DoctorController.createDoctorProfile
);
/**
 * @swagger
 * /doctors/me:
 *   get:
 *     summary: Get logged-in doctor's profile
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Doctor profile details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Doctor profile not found
 */
router.get(
  "/me",
  AuthMiddleware.isLoggedIn,
  RoleCheck.allowRoles("doctor"),
  DoctorController.getDoctorProfile
);
/**
 * @swagger
 * /doctors/verify/{id}:
 *   put:
 *     summary: Verify a doctor profile (Admin only)
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Doctor user ID
 *     responses:
 *       200:
 *         description: Doctor verified successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Doctor not found
 */
router.put(
  "/verify/:id",
  AuthMiddleware.isLoggedIn,
  AuthMiddleware.requireAdmin,
  DoctorController.verifyDoctor
);
/**
 * @swagger
 * /doctors/unverify/{id}:
 *   put:
 *     summary: Unverify a doctor profile (Admin only)
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Doctor user ID
 *     responses:
 *       200:
 *         description: Doctor unverified successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Doctor not found
 */
router.put(
  "/unverify/:id",
  AuthMiddleware.isLoggedIn,
  AuthMiddleware.requireAdmin,
  DoctorController.unverifyDoctor
);

module.exports = router;
