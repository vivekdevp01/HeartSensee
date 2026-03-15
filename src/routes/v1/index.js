const express = require("express");

const { InfoController } = require("../../controllers");
const userRoutes = require("./user-routes");
const doctorRoutes = require("./doctor-routes");
const adminRoutes = require("./admin-routes");
const ecgreportRoutes = require("./ecgreport-routes");
const patientRequestRoutes = require("./patientrequest-routes");
const ecgreadingRoutes = require("./ecgreading-routes");

const router = express.Router();

router.get("/info", InfoController.info);
router.use("/users", userRoutes);
router.use("/doctors", doctorRoutes);
router.use("/admins", adminRoutes);
router.use("/ecgreports", ecgreportRoutes);
router.use("/requests", patientRequestRoutes);
router.use("/readings", ecgreadingRoutes);

module.exports = router;
