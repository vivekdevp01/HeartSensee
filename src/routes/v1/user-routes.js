// import { AuthMiddleware } from "../../middlewares";

const express = require("express");
const router = express.Router();
const { UserController } = require("../../controllers");
const { UserMiddleware, AuthMiddleware } = require("../../middlewares");
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */
/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               age:
 *                 type: integer
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
router.post(
  "/signup",
  UserMiddleware.validateUser([
    "email",
    "password",
    "firstName",
    "lastName",
    "age",
  ]),
  UserController.createUser
);
/**
 * @swagger
 * /users/signin:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/signin",
  UserMiddleware.validateUser(["email", "password"]),
  UserController.signIn
);
/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get logged-in user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 age:
 *                   type: integer
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */
router.get("/me", AuthMiddleware.isLoggedIn, UserController.getUser);
/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Update logged-in user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               age:
 *                 type: integer
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */
router.put("/me", AuthMiddleware.isLoggedIn, UserController.updateUser);
/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: Delete logged-in user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/me", AuthMiddleware.isLoggedIn, UserController.deleteAccount);

module.exports = router;
