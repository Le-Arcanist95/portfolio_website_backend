const Experience = require('../models/experienceModel');
const User = require('../models/userModel');
const {validationResult} = require('express-validator');

// GET ALL EXPERIENCES
exports.getAllExperiences = async (req, res, next) => {
    try {
        const experiences = await Experience.find({});
        res.status(200).send(experiences);
    } catch (err) {
        res.status(500);
        return next(err);
    }
}

// GET ONE EXPERIENCE
exports.getOneExperience = async (req, res, next) => {
    try {
        const experience = await Experience.findById(req.params.experienceId);
        if (!experience) {
            res.status(404);
            return next(new Error('Experience not found'));
        }
        res.status(200).send(experience);
    } catch (err) {
        res.status(500);
        return next(err);
    }
}

// POST NEW EXPERIENCE
exports.postNewExperience = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422);
        return next(new Error(errors.array().map(err => err.msg).join(', ')));
    }
    try {
        const user = await User.findById(req.auth._id);
        const dateObject = {
            startDate: new Date(req.body.startDate),
            endDate: new Date(req.body.endDate)
        }
        if (dateObject.startDate > dateObject.endDate) {
            res.status(422);
            return next(new Error('Start date must be before end date'));
        }
        req.body.startDate = dateObject.startDate;
        req.body.endDate = dateObject.endDate;
        req.body.user = user._id;
        const newExperience = new Experience(req.body);
        await newExperience.save();
        user.experience.push(newExperience);
        await user.save();
        res.status(201).send(newExperience);
    } catch (err) {
        res.status(500);
        return next(err);
    }
}

// UPDATE EXPERIENCE
exports.updateExperience = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422);
        return next(new Error(errors.array().map(err => err.msg).join(', ')));
    }
    try {
        const updatedExperience = await Experience.findOneAndUpdate(
            {_id: req.params.experienceId, user: req.auth._id},
            req.body,
            {new: true}
        );
        if (!updatedExperience) {
            res.status(404);
            return next(new Error('Experience not found'));
        }
        res.status(201).send(updatedExperience);
    } catch (err) {
        res.status(500);
        return next(err);
    }
}

// DELETE EXPERIENCE
exports.deleteExperience = async (req, res, next) => {
    try {
        const deletedExperience = await Experience.findOneAndDelete(
            {_id: req.params.experienceId, user: req.user._id}
        );
        if (!deletedExperience) {
            res.status(404);
            return next(new Error('Experience not found'));
        }
        res.status(200).send(deletedExperience);
    } catch (err) {
        res.status(500);
        return next(err);
    }
}