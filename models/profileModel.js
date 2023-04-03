// Import Mongoose and Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Schema - Must include:
    // First Name
    // Last Name
    // Bio
    // Location
    // Skills
    // Links (Github, LinkedIn, Portfolio)
    // Email
    // User (ref: User)
const profileSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    location: {
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        }
    },
    skills: {
        type: [String],
        required: true
    },
    links: {
        github: {
            type: String,
            required: true
        },
        linkedIn: {
            type: String,
            required: true
        },
        portfolio: {
            type: String,
            required: true
        },
        resume: {
            type: String,
            required: true
        }
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});

// Export Model
module.exports = mongoose.model('Profile', profileSchema);