const express = require('express');
const route = express.Router();
const {cloudinary, upload} = require('../cloudinaryconfig');
const {authMiddleware} = require('../middleware/authMiddleware')
const {
    createUser,
    updateuser,
    deleteUser,
    loginUser,
    getuserbyId,
    toggleBookmark,
    getBookmarks,
    sendQuery,
    getQueries,
    updateAvatar,
    getstatNo,
    verifyEmail,
    resendVerificationEmail
}=require('../Controller/userController')

route.post('/create', createUser);
route.post('/login', loginUser);
route.get('/verify-email/:userId/:token', verifyEmail);
route.post('/resend-verification', resendVerificationEmail);
route.get('/bookmarks', authMiddleware, getBookmarks);
route.post('/bookmarks', authMiddleware, toggleBookmark);
route.get('/getuser/:id', authMiddleware, getuserbyId);
route.put('/edituser/:id', authMiddleware, updateuser);
route.delete('/:id', deleteUser);

route.post('/send', authMiddleware, sendQuery);

route.get('/my-queries', authMiddleware, getQueries);

route.put('/avatar', authMiddleware, upload.single('avatar'),updateAvatar);

route.get('/stat', authMiddleware, getstatNo);

module.exports = route;
