const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;


const {
    getAllActivities,
    getActivityById,
    getActivityByName,
    attachActivitiesToRoutines,
    createActivity,
    updateActivity,
} = require('../db');

// GET /api/activities/:activityId/routines

// GET /api/activities
router.get('/' , async (req,res) => {
    const activities = await getAllActivities();
    res.send({ activities });
});
// POST /api/activities

router.post ('/', async (req,res,next) => {
    const {name,description} = req.body
    try {
        const activitiesCreated = await createActivity(req.body);
        res.send(activitiesCreated)

    } catch(error){
    next(error);
    }
});

// PATCH /api/activities/:activityId


module.exports = router;
