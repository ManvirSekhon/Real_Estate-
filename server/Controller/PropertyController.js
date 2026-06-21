const Property = require('../models/Property')

const addProperty = async (req, res) => {
    try {
        const { title, description, price, address, city, state, bedrooms, bathrooms, square_foot, parking, property_type } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload an image" });
        }

        const userID = req.user.id;
        const imageUrl = req.file.path;

        const property = await Property.create({ title, description, price, address, city, state, bedrooms, bathrooms, square_foot, parking, property_type, postedBy: userID, image: imageUrl, cloudinary_id: req.file.filename});

        res.status(200).json({
            success: true,
            data: property,
            message: 'Property added successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getUserProperties = async (req, res) => {
    try {
        const userID = req.user.id;
        // console.log("User ID from token:", userID); 
        const properties = await Property.find({ postedBy: userID });
        res.status(200).json({
            success: true,
            data: properties,
            message: 'User properties retrieved successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getAllProperties = async (req, res) => {
    try {
        const allProperties = await Property.find().populate('postedBy', 'name email number');; // Property is your Mongoose Model
        res.status(200).json(allProperties);
    } catch (err) {
        res.status(500).json(err);
    }
}

const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate('postedBy', 'name email number');
        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }
        res.status(200).json(property);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findByIdAndDelete(req.params.id);
        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Property deleted successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


const updateProperty = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // ❌ remove postedBy if coming from frontend
    delete updateData.postedBy;

    // ✅ handle image update
    if (req.file) {
      updateData.image = req.file.path;
      updateData.cloudinary_id = req.file.filename;
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.status(200).json({
      success: true,
      data: property,
      message: 'Property updated successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const property = {
    addProperty,
    getUserProperties,
    getAllProperties,
    deleteProperty,
    updateProperty,
    getPropertyById
}

module.exports = property; 