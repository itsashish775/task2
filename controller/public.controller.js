const { sendEmail } = require("../emailService")
const User = require("../models/user.model")
const bcrypt = require('bcryptjs');
const Video = require("../models/video.model");

const publicController = {
    createAccount: async (req, res) => {
        try {
            if (req.body.email == "ashish@singsys.com") {
                throw new Error("invalid email")
            }
            const { email, fName, lName, mobileNumber } = req.body
            const password = fName.substr(0, 3) + lName.substr(0, 3) + mobileNumber.substr(0, 3)
            let user = await User.create({ email, fName, lName, mobileNumber, password })
            if (user) {
                const subject = 'Account Creation';
                const text = `Dear user,
                your First name is ${fName},
                password is ${password}`;
                sendEmail(email, subject, text)
            }

            res.status(201).json({ status: 201, message: "your accout created successful, password and first name has been sent to you over registed mail" })
        } catch (error) {
            res.status(500).json({
                message: "Some Error ...",
                err: error.message
            })
        }
    },
    login: async (req, res) => {
        try {
            const { fName, password } = req.body
            let user = await User.findOne({ fName: fName })
            if (!user) {
                throw new Error("user is Not registerd")
            }
            if (user) {
                let matchPass = await bcrypt.compare(password, user.password)

                if (!matchPass) {
                    throw new Error("password not matched")
                }
                res.status(200).json({
                    message: "user login",
                    data: user
                })
            }
            // res.json({ fName, password })
        } catch (error) {
            res.status(500).json({
                message: "Some Error ...",
                err: error.message
            })
        }
    },
    getAuthData: async (req, res) => {
        try {
            let id = req.body.id
            let userDetails = await User.findById(id);
            let videos = await Video.find({ uploadedBy: id });
            res.status(200).json({
                status: 200,
                message: "data fetched",
                data: userDetails,
                videos
            })
        } catch (error) {
            res.status(500).json({
                message: "Some Error ...",
                err: error.message
            })
        }
    },
    updateBio: async (req, res) => {
        try {
            let id = req.body.id
            let bio = req.body.bio

            let userDetails = await User.updateOne({ _id: id }, { $set: { bio: bio } });
            console.log(userDetails, id, bio);
            res.status(200).json({
                status: 200,
                message: "bio updated",
            })
        } catch (error) {
            res.status(500).json({
                message: "Some Error ...",
                err: error.message
            })
        }
    },
    uploadImage: async (req, res) => {
        try {
            if (req.file) {
                const data = `${process.env.BACKEND_URL}/${req.file.filename}`;
                return res.status(200).json({
                    status: 200,
                    message: 'Image upload successful',
                    url: data,
                });
            }
        } catch (error) {

            res.status(500).json({
                message: "Some Error ...",
                err: error.message
            })
        }
    },
    uploadVideo: async (req, res) => {
        try {
            if (req.file) {
                const data = `${process.env.BACKEND_URL}/${req.file.filename}`;
                return res.status(200).json({
                    status: 200,
                    message: 'Video upload successful',
                    url: data,
                });
            }
        } catch (error) {

            res.status(500).json({
                message: "Some Error ...",
                err: error.message
            })
        }
    },
    updateProfilePic: async (req, res) => {
        try {
            let { imageUrl, id } = req.body;
            let userDetails = await User.updateOne({ _id: id }, { $set: { profileImage: imageUrl } });
            return res.status(200).json({
                status: 200,
                message: 'Image update successful',
            });
        } catch (error) {

            res.status(500).json({
                message: "Some Error ...",
                err: error.message
            })
        }
    },
    uploadVideoContent: async (req, res) => {
        try {
            // let { imageUrl, id } = req.body;

            let videoCreate = await Video.create(req.body);
            return res.status(200).json({
                status: 200,
                message: 'video uploaded update successful',
            });
        } catch (error) {

            res.status(500).json({
                message: "Some Error ...",
                err: error.message
            })
        }
    },
    listing: async (req, res) => {
        try {

            let data = await User.find()
            const fullData = await User.aggregate([
                {
                    $lookup: {
                        from: 'videos', // Name of the collection to join with
                        localField: '_id', // Field from the User collection
                        foreignField: 'uploadedBy', // Field from the Videos collection
                        as: 'videos' // The array field in the output documents
                    }
                }
            ]);
            res.status(200).json({ status: 200, message: "data fetched", data: fullData })
        } catch (error) {

            res.status(500).json({
                message: "Some Error ...",
                err: error.message
            })
        }
    }
}
module.exports = publicController