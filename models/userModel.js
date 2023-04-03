// Import Mongoose and Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// Define Schema - Must include:
    // Username
    // Password
    // Email
    // Profile (ref: Profile)
    // Experience (ref: Experience)
    // Projects (ref: Projects)
const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'Profile',
        default: null
    },
    experience: {
        type: Array,
        prefixItems: {
            type: Schema.Types.ObjectId,
            ref: 'Experience'
        },
        default: []
    },
    projects: {
        type: Array,
        prefixItems: {
            type: Schema.Types.ObjectId,
            ref: 'Project'
        },
        default: []
    }
}, {timestamps: true});

// Create method functions
userSchema.pre('save', function(next) {
    let user = this;
    if(!user.isModified('password')) return next();
    
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;
    next();
});

userSchema.methods.withoutPassword = function(){
    const user = this.toObject();
    delete user.password;
    return user;
}

userSchema.methods.comparePassword = function(enteredPassword, callback){
    bcrypt.compare(enteredPassword, this.password, (err, isMatch) => {
        if(err) return callback(err);
        callback(null, isMatch);
    });
}

// Export Model
module.exports = mongoose.model('User', userSchema);