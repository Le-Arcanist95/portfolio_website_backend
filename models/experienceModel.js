// Import Mongoose and Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Schema - Must include:
    // Company Name
    // Job Title
    // Start Date
    // End Date
    // Current Job
    // Description
const experienceSchema = new Schema({
    companyName: {
        type: String,
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    currentJob: {
        type: Boolean,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});

// Export Model
module.exports = mongoose.model('Experience', experienceSchema);