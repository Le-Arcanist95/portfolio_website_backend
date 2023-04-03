const Profile = require('../models/profileModel.js');
const User = require('../models/userModel.js');
const { validationResult } = require('express-validator');

// GET ALL PROFILES
exports.getAllProfiles = async (req, res, next) => {
    try {
        const profiles = await Profile.find({});
        res.status(200).send(profiles);
    } catch (err) {
        res.status(500);
        return next(err);
    }
}

// GET ONE PROFILE
exports.getOneProfile = async (req, res, next) => {
    try {
        const profile = await Profile.findById(req.params.profileId);
        if (!profile) {
            res.status(404);
            return next(new Error('Profile not found'));
        }
        res.status(200).send(profile);
    } catch (err) {
        res.status(500);
        return next(err);
    }
}

// POST NEW PROFILE
exports.postNewProfile = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400);
            return next(new Error(errors.array().map(err => err.msg).join(', ')));
        }
        req.body.user = req.auth._id;
        const user = await User.findById(req.auth._id);
        const newProfile = new Profile(req.body);
        newProfile.user = user;
        await newProfile.save();
        user.profile = newProfile._id;
        await user.save();
        res.status(201).send(newProfile); 
    } catch (err) {
        res.status(500);
        return next(err);
    }
}

// UPDATE PROFILE
exports.updateProfile = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400);
            return next(new Error(errors.array().map(err => err.msg).join(', ')));
        }
        const user = await User.findById(req.auth._id);
        const profile = await Profile.findById(req.params.profileId);
        if (!profile) {
            res.status(404);
            return next(new Error('Profile not found'));
        }
        if (!user._id.equals(profile.user)) {
            res.status(401);
            return next(new Error('Unauthorized'));
        }
        const updatedProfile = await Profile.findOneAndUpdate(
            {_id: req.params.profileId},
            req.body,
            {new: true}
        );
        res.status(200).send(updatedProfile);
    } catch (err) {
        res.status(500);
        return next(err);
    }
}

// DELETE PROFILE
exports.deleteProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        const profile = await Profile.findById(req.params.profileId);
        if (!profile) {
            res.status(404);
            return next(new Error('Profile not found'));
        }
        if (!user._id.equals(profile.user)) {
            res.status(401);
            return next(new Error('Unauthorized'));
        }
        await profile.remove();
        res.status(200).send(profile);
    } catch (err) {
        res.status(500);
        return next(err);
    }
}

// GET PROFILE BY USER ID
exports.getProfileByUserId = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({user: req.params.userId});
        if (!profile) {
            res.status(404);
            return next(new Error('Profile not found'));
        }
        res.status(200).send(profile);
    } catch (err) {
        res.status(500);
        return next(err);
    }
}