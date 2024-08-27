const express = require("express")
const publicController = require("../controller/public.controller")
const upload = require("../middleware/upload")
const router = express.Router()

// router.get("/*", async (req, res) => {
//     res.status(400).json({ message: "Invalid route" })
// })

router.post("/createAccount", publicController.createAccount)
router.post("/login", publicController.login)
router.post("/upload-image", upload.single('file'), publicController.uploadImage)
router.post("/upload-video", upload.single('file'), publicController.uploadVideo)
router.post("/getAuthData", publicController.getAuthData)
router.post("/updateBio", publicController.updateBio)
router.post("/updateProfilePic", publicController.updateProfilePic)
router.post("/uploadVideoContent", publicController.uploadVideoContent)
router.get("/listing", publicController.listing)



module.exports = router