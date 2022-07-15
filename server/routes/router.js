const express = require("express");
const router = express.Router();
const tasksServices = require("../services/tasksServices")
const tasksController = require("../controller/tasksController")

// services
router.get("/", tasksServices.index);

// API get all
router.get("/api/tasks", tasksController.get);

// API add new task
router.post("/api/tasks/add", tasksController.add);

// API update the task
router.put("/api/tasks/update/:id", tasksController.update);

// API delete the task
router.delete("/api/tasks/delete/:id", tasksController.delete)

module.exports = router;
