// Import Mongoose and Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Schema - Must include:
    // Project Name
    // Project Description
    // Project Skills - Array of Strings
    // Project Image
    // Project Link
    // User (ref: User)
const projectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    deploymentLink: {
        type: String,
        required: true
    },
    githubLink: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});

// Export Model
module.exports = mongoose.model('Project', projectSchema);