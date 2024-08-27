const mongoose = require('mongoose');


const videoSchema = mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            unique: true,
            trim: true,
        },
        videoURL: {
            type: String,
        },
        uploadedBy: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);



const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
