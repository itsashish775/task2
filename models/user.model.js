const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        fName: {
            type: String,
            unique: true,
            trim: true,
        },
        lName: {
            type: String,
            unique: true,
            trim: true,
        },
        mobileNumber: {
            type: String,
        },
        profileImage: {
            type: String,
        },
        email: {
            type: String,
            trim: true,
            unique: true,
            lowercase: true,
        },

        password: {
            type: String,
            trim: true,
            minlength: 6,

        },
        bio: {
            type: String,
            trim: true,
            maxlength: 1000
        }
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json





// match password method
userSchema.methods.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
};



userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const changeQuery = async function (next) {
    this.where({ isDeleted: { $in: [false, undefined] } });
    next();
};
const changePipeline = function (next) {
    // Modify the aggregation pipeline to add a $match stage
    this.pipeline().unshift({ $match: { isDeleted: { $in: [false, undefined] } } });
    next();
};

userSchema.pre('find', changeQuery);
userSchema.pre('findMany', changeQuery);
userSchema.pre('findOne', changeQuery);
userSchema.pre('count', changeQuery);
userSchema.pre('aggregate', changePipeline);


const User = mongoose.model('User', userSchema);

module.exports = User;
