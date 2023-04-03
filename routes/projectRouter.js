const express = require('express');
const projectRouter = express.Router();
const { getAllProjects, getOneProject, postNewProject, updateProject, deleteProject } = require('../controllers/projectController');

// All routes are prepended with /project
projectRouter.route('/')
    .get(getAllProjects)
    .post(postNewProject);

// All routes are prepended with /project/:projectId
projectRouter.route('/:projectId')
    .get(getOneProject)
    .put(updateProject)
    .delete(deleteProject);

// Export
module.exports = projectRouter;