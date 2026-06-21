const express = require('express');
const route = express.Router();
const {authMiddleware, adminMiddleware} = require('../middleware/authMiddleware');
const {getStatistics, getAllUsers, deleteUser, getAllProperties, getUserById, updateuser} = require('../Controller/adminController');

route.get('/statistics',authMiddleware, adminMiddleware, getStatistics);
route.get('/users',authMiddleware, adminMiddleware, getAllUsers);
route.get('/edituser/:id',  authMiddleware, adminMiddleware,  getUserById);
route.put('/updateuser/:id', authMiddleware, adminMiddleware, updateuser);

route.delete('/delete/:id', authMiddleware,  adminMiddleware, deleteUser);
route.get('/properties', authMiddleware, adminMiddleware, getAllProperties);

module.exports = route;