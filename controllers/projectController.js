const Project = require('../models/projectModel.js');
const User = require('../models/userModel.js');
const { validationResult } = require('express-validator');

// GET ALL PROJECTS
exports.getAllProjects = async (req, res, next) => {
    try {
        const projects = await Project.find({});
        res.status(200).send(projects);
    } catch (err) {
        res.status(500);
        return next(err);
    }
}

// GET ONE PROJECT
exports.getOneProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            res.status(404);
            return next(new Error('Project not found'));
        }
        res.status(200).send(project);
    } catch (err) {
        res.status(500);
        return next(err);
    }
}

// POST NEW PROJECT
exports.postNewProject = async (req, res, next) => {
    try {
        const user = await User.findById(req.auth._id);
        const newProject = new Project(req.body);
        newProject.user = user._id;
        await newProject.save();
        user.projects.push(newProject);
        await user.save();
        res.status(201).send(newProject);
    } catch (err) {
        res.status(500);
        return next(err);
    }
}

// UPDATE PROJECT
exports.updateProject = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400);
            return next(new Error(errors.array().map(err => err.msg).join(', ')));
        }
        const user = await User.findById(req.auth._id);
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            res.status(404);
            return next(new Error('Project not found'));
        }
        if (!project.user.equals(user._id)) {
            res.status(401);
            return next(new Error('Unauthorized'));
        }
        await Project.findByIdAndUpdate(req.params.projectId, req.body, { new: true });
        res.status(200).send(project);
    } catch (err) {
        res.status(500);
        return next(err);
    }
}

// DELETE PROJECT
exports.deleteProject = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            res.status(404);
            return next(new Error('Project not found'));
        }
        if (!project.user.equals(user._id)) {
            res.status(401);
            return next(new Error('Unauthorized'));
        }
        await project.remove();
        res.status(200).send('Project successfully deleted');
    } catch (err) {
        res.status(500);
        return next(err);
    }
}