const Property = require('../models/Property')
const User = require('../models/User')

const getStatistics = async(req, res) => {
    try {
        const userCount = await User.countDocuments();
        const propertyCount = await Property.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                userCount,
                propertyCount
            },
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
};

const getAllUsers = async(req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success:true,
            data:users
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

const deleteUser = async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user){
            res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message:  error.message
        })
    }
}

const getAllProperties = async(req, res) => {
    try {
        const properties = await Property.find();
        res.status(200).json({
            success: true,
            data: properties
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getUserById = async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const updateuser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
        res.status(200).json({
            success: true,
            data: user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const control  = {
    getStatistics,
    getAllUsers,
    deleteUser,
    getAllProperties,
    getUserById,
    updateuser
}

module.exports = control;