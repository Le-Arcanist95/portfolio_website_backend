const express = require('express');
const experienceRouter = express.Router();
const { getAllExperiences, getOneExperience, postNewExperience, updateExperience, deleteExperience } = require('../controllers/experienceController');

// All routes are prepended with /experience
experienceRouter.route('/')
    .get(getAllExperiences)
    .post(postNewExperience);


// All routes are prepended with /experience/:experienceId
experienceRouter.route('/:experienceId')
    .get(getOneExperience)
    .put(updateExperience)
    .delete(deleteExperience);

// Export
module.exports = experienceRouter;
