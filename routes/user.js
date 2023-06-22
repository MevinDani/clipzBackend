const express = require('express')
const User = require('../service/userDb')
// const bcrypt = require('bcrypt')
const logic = require('../logic/logic')
const { route } = require('./posts')
const cloudinary = require('../utils/cloudinary')
const upload = require('../middleware/multer')
const tokenMiddle = require('../middleware/token')
const router = express.Router()


router.post('/signup', (req, res) => {
    logic.register(req.body.username, req.body.password).then(result => {
        res.status(201).json(result)
    }).catch(err => {
        res.status(401).json(err)
    })
})

router.post('/login', (req, res) => {
    logic.login(req.body.username, req.body.password).then(result => {
        res.status(200).json(result)
    }).catch(err => {
        res.status(401).json(err)
    })
})

router.get('/profile/:name', (req, res) => {
    logic.getUserN(req.params.name).then(result => {
        res.status(200).json(result)
    }).catch(err => {
        res.status(403).json({
            message: 'Username donot exists',
        })
    })
})

router.get('/:id', (req, res) => {
    logic.getUser(req.params.id).then(result => {
        res.status(200).json(result)
    }).catch(err => {
        res.status(403).json({
            message: 'UserId donot exists'
        })
    })
})

router.put('/follow/:id', (req, res) => {
    logic.followUser(req.params.id, req.body.id).then(result => {
        res.status(200).json(result)
    }).catch(err => {
        res.status(403).json({
            message: 'UserId (follow) donot exists'
        })
    })
})

router.put('/unfollow/:id', (req, res) => {
    logic.unfollowUser(req.params.id, req.body.id).then(result => {
        res.status(200).json(result)
    }).catch(err => {
        res.status(403).json({
            message: 'UserId (follow) donot exists'
        })
    })

})

router.get('/followersList/:id', (req, res) => {
    logic.followerList(req.params.id).then(result => {
        res.status(200).json(result)
    }).catch(err => {
        res.status(401).json({
            message: 'UserId donot exists'
        })
    })
})

router.get('/idtoName/:id', (req, res) => {
    logic.getUser(req.params.id).then(result => {
        res.status(200).json(result)
    }).catch(err => {
        res.status(403).json({
            message: 'UserId donot exists'
        })
    })
})

router.put('/profile/edit/', upload.single('image'), async (req, res) => {
    // console.log(req.file);
    if (req.file) {
        cloudinary.uploader.upload(req.file.path, async (err, result) => {
            // console.log(result);
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: 'Error'
                })
            }
            const userOldDetails = await User.findById(req.body.id)
            userOldDetails.username = req.body.username
            userOldDetails.about = req.body.about
            userOldDetails.profilePic = result.url
            userOldDetails.followers = userOldDetails.followers
            userOldDetails.followings = userOldDetails.followings
            userOldDetails.followersName = userOldDetails.followersName
            userOldDetails.followingsName = userOldDetails.followingsName

            await Post.updateMany({ creator: req.body.id }, { name: req.body.username })
            await userOldDetails.save()
                .then((result) => {
                    console.log(result);
                    res.status(200).json({ message: 'Profile Edited Successfully', data: result });
                })
                .catch((error) => {
                    console.log(error);
                    res.status(500).json({ message: 'Unauthorized user' });
                });
        })
    } else {
        const userOldDetails = await User.findById(req.body.id)
        userOldDetails.username = req.body.username
        userOldDetails.about = req.body.about
        userOldDetails.profilePic = req.body.image
        userOldDetails.followers = userOldDetails.followers
        userOldDetails.followings = userOldDetails.followings
        userOldDetails.followersName = userOldDetails.followersName
        userOldDetails.followingsName = userOldDetails.followingsName

        await Post.updateMany({ creator: req.body.id }, { name: req.body.username })
        await userOldDetails.save()
            .then((result) => {
                console.log(result);
                res.status(200).json({ message: 'Profile Edited Successfully', data: result });
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({ message: 'Unauthorized user' });
            });
    }
})

router.get('/profilePics/:uname', (req, res) => {
    logic.getProfilePics(req.params.uname).then(result => {
        res.status(200).json(result)
    }).catch(err => {
        res.status(403).json({
            message: err
        })
    })
})


module.exports = router
