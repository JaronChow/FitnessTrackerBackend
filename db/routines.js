const {attachActivitiesToRoutines } = require('./activities');
const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {rows: [routine]} = await client.query(`
      INSERT INTO routines ( "creatorId", "isPublic", name, goal)
      VALUES ($1,$2,$3,$4)
      ON CONFLICT (name) DO NOTHING
      RETURNING *
    ;`, [creatorId, isPublic, name, goal])
    return routine
  }catch (error){
    console.log(error)
  }
}

async function getRoutineById(id) {
  try{
    const { rows: [ routine ] } = await client.query(`
      SELECT *
      FROM routines
      WHERE id=$1;
    `,[id]);
    return routine;
  }catch (error) {
    console.log(error)
  }
}


async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query (`
    SELECT *
    FROM routines;
    `)
    return rows
  }catch (error){
    console.log(error)
  }
}


// activities attached for functions below
async function getAllRoutines() {
  try{
    const { rows } = await client.query (`
    SELECT routines.* , users.username AS "creatorName" 
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    ;`);
  
  return attachActivitiesToRoutines(rows);
  }catch (error){
    console.log(error)
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows } = await client.query(`
    SELECT routines.*, users.username AS "creatorName" 
    From routines
    JOIN users ON routines."creatorId"= users.id
    WHERE "isPublic"=true
    `);

    return attachActivitiesToRoutines(rows)
  } catch (error) {
    console.log(error)
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(`
    SELECT routines.*, users.username as "creatorName"
    FROM routines 
    JOIN users ON routines."creatorId"= users.id
    WHERE username=$1
    ;`, [username]);

    return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.log(error)
  }
}


async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(`
    SELECT routines.*, users.username as "creatorName"
    FROM routines 
    JOIN users ON routines."creatorId"= users.id
    WHERE username=$1 AND "isPublic" = true
    ;`, [username]);

    return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.log(error)
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows: routines } = await client.query(`
    SELECT routines.*, users.username as "creatorName"
    FROM routines
    JOIN users ON routines."creatorId"= users.id
    JOIN routine_activities ON routine_activities."routineId" = routines.id
    WHERE routine_activities."activityId" =$1 AND "isPublic" = true
    ;`, [id]);

    return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.log(error)
  }
}

async function updateRoutine({ id, ...fields }) {
try {
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  const {rows: [routine]} = await client.query(`
    UPDATE routines
    SET ${setString}
    WHERE id = ${ id }
    RETURNING *
  ;`, Object.values(fields))
    return routine
  }catch (error){
    console.log(error)
  }
}
async function destroyRoutine(id) {
  try {
    await client.query(`
      DELETE FROM routine_activities
      WHERE "routineId" = $1
      RETURNING * 
    `, [id]);
    const { rows: [routine] } = await client.query(`
      DELETE FROM routines 
      WHERE id = $1 
      RETURNING *
    `, [id]);

    return routine;
  } catch(error){
      console.log(error);
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
