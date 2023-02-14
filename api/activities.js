const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;


const {
    getAllActivities,
    getActivityById,
    getActivityByName,
    getPublicRoutinesByActivity,
    createActivity,
    updateActivity,

} = require('../db');

// GET /api/activities/:activityId/routines
router.get('/:activityId/routines' , async (req,res,next) => {
    const activityId = req.params.activityId;

    const activity = await getActivityById(activityId)
    console.log(activity ,"activity")
    if(activity){
        try {
            const routines = await getPublicRoutinesByActivity(activityId);
            console.log(routines , 'roasdfs')
            res.send(routines);
        }catch({name, message}) {
            next({name, message});
        }
    }else {
        res.send({
            error: "ActivityNotFound",
            name: "ActivityNotFound",
            message: `Activity ${activityId} not found`
        })
    }
});


// GET /api/activities
router.get("/", async (req, res, next) => {
  try {
    const getActivities = await getAllActivities();
    res.send(getActivities);
  } catch (error) {
    next({
      error: "There are no activities!",
      name: "Activity does not exist",
      message: `There are no activities!`,
    });
  }
});
// POST /api/activities

router.post ('/', async (req,res,next) => {
    const {name,description} = req.body
    try {
        const activitiesCreated = await createActivity({name,description});
        res.send(activitiesCreated)
    } catch(error){
    next({
        error: "There are no activities!",
        name: "Activity does not exist",
        message: `There are no activities!`,
        });
    }
});

// PATCH /api/activities/:activityId


module.exports = router;
