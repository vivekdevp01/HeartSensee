const express = require("express");
const router = express.Router();
const { AuthMiddleware } = require("../../middlewares");
const { AdminController } = require("../../controllers");
/**
 * @swagger
 * tags:
 *   name: Admins
 *   description: Admin management APIs
 */

/**
 * @swagger
 * /admins/add:
 *   post:
 *     summary: Create a new admin
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: StrongPass123
 *               role:
 *                 type: string
 *                 example: admin
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/add",
  AuthMiddleware.isLoggedIn,
  AuthMiddleware.requireSuperadmin,
  AdminController.createAdmin
);
/**
 * @swagger
 * /admins:
 *   get:
 *     summary: Get all admins
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of admins
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/",
  AuthMiddleware.isLoggedIn,
  AuthMiddleware.requireSuperadmin,
  AdminController.listAllAdmins
);
/**
 * @swagger
 * /admins/{id}:
 *   get:
 *     summary: Get an admin by ID
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Admin ID
 *     responses:
 *       200:
 *         description: Admin details
 *       404:
 *         description: Admin not found
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/:id",
  AuthMiddleware.isLoggedIn,
  AuthMiddleware.requireSuperadmin,
  AdminController.getAdminById
);
/**
 * @swagger
 * /admins/{id}:
 *   delete:
 *     summary: Delete an admin by ID
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Admin ID
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *       404:
 *         description: Admin not found
 *       401:
 *         description: Unauthorized
 */
router.delete(
  "/:id",
  AuthMiddleware.isLoggedIn,
  AuthMiddleware.requireSuperadmin,
  AdminController.deleteAdmin
);

module.exports = router;
