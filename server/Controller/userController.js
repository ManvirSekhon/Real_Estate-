const User = require('../models/User');
const Query = require('../models/Query');
const Property = require('../models/Property');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendWelcomeEmail, sendLoginAlert, sendVerificationEmail } = require('../utils/sendEmail');
const mongoose = require('mongoose');

const nodemailer = require("nodemailer");

const getFrontendUrl = () => {
    return (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '');
};

const generateVerificationToken = () => {
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    return { token, hashedToken, expiresAt };
};

const getstatNo = async (req, res) => {
    try {
        const totalProperties = await Property.countDocuments({ postedBy: req.user.id });
        const totalQueries = await Query.countDocuments({ buyer: req.user.id });

        const totalCostAgg = await Property.aggregate([
            {
                $match: {
                    postedBy: new mongoose.Types.ObjectId(req.user.id)
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$price" }
                }
            }
        ]);
        const totalBookmarks = await User.findById(req.user.id);


        res.status(200).json({
            success: true,
            data: {
                totalProperties,
                totalQueries,
                totalCost: totalCostAgg.length > 0 ? totalCostAgg[0].total : 0,
                totalBookmarks: totalBookmarks ? totalBookmarks.bookmarks.length : 0
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

// Create a new user with email verification
const createUser = async (req, res) => {
    try {
        const { name, email, password, number, city, state, zipcode } = req.body;

        if (!name || !email || !password || !number || !city || !state || !zipcode) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            })
        }

        const { token, hashedToken, expiresAt } = generateVerificationToken();

        const user = await User.create({
            name,
            email: normalizedEmail,
            password,
            number,
            city,
            state,
            zipcode,
            isEmailVerified: false,
            emailVerificationToken: hashedToken,
            emailVerificationExpire: expiresAt
        });

        const verificationLink = `${getFrontendUrl()}/verify-email/${user._id}/${token}`;
        let emailSent = true;

        try {
            await sendVerificationEmail(user.email, user.name, verificationLink);
        } catch (emailError) {
            emailSent = false;
            console.error('Failed to send verification email:', emailError.message);
        }

        res.status(201).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                isEmailVerified: user.isEmailVerified,
                emailSent
            },
            message: emailSent
                ? 'User created successfully. Please check your email to verify your account.'
                : 'User created successfully, but the verification email could not be sent. Please use resend verification email.'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const verifyEmail = async (req, res) => {
    try {
        const { userId, token } = req.params;

        if (!userId || !token) {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification link'
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID in verification link'
            });
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findById(userId).select('+emailVerificationToken');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.isEmailVerified) {
            return res.status(200).json({
                success: true,
                message: 'Email is already verified. You can login now.'
            });
        }

        if (!user.emailVerificationToken || user.emailVerificationToken !== hashedToken) {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification token. Please request a new verification email.',
                code: 'INVALID_TOKEN'
            });
        }

        if (!user.emailVerificationExpire || user.emailVerificationExpire < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Verification link has expired. Please request a new verification email.',
                code: 'TOKEN_EXPIRED'
            });
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationExpire = null;
        await user.save();

        sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: 'Email verified successfully! You can now login to your account.',
            data: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail }).select('+emailVerificationToken');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found with this email'
            });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: 'Email is already verified',
                code: 'EMAIL_ALREADY_VERIFIED'
            });
        }

        const { token, hashedToken, expiresAt } = generateVerificationToken();
        user.emailVerificationToken = hashedToken;
        user.emailVerificationExpire = expiresAt;
        await user.save();

        const verificationLink = `${getFrontendUrl()}/verify-email/${user._id}/${token}`;
        await sendVerificationEmail(user.email, user.name, verificationLink);

        res.status(200).json({
            success: true,
            message: 'Verification email sent successfully. Please check your inbox and spam folder.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update a user by ID

// const updateuser = async (req, res) => {
//     try {
//         const user = await User.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after', runValidators: true })

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'User not found'
//             })
//         }
//         res.status(200).json({
//             success: true,
//             data: user
//         })
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }

const updateuser = async (req, res) => {
    try {
        // 1. Find the user first
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // 2. Update the fields from req.body
        // This handles name, email, number, city, etc.
        Object.keys(req.body).forEach((update) => {
            user[update] = req.body[update];
        });

        // 3. Use .save() so the pre('save') hook in your schema triggers!
        await user.save();

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
};

// Delete a user by ID

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
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


// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        // 1. Find the user by email
        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // New users created after this feature must verify email before login.
        // Existing users without this field are not blocked unexpectedly.
        if (user.isEmailVerified === false) {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email before logging in. Check your inbox or resend the verification email.',
                code: 'EMAIL_NOT_VERIFIED',
                email: user.email
            });
        }

        // 2. Compare the typed password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // 3. If password matches, create the JWT token!
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Token lasts for 1 day
        );
        sendLoginAlert(user.email, user.name);
        // 4. Send back the token and user data
        res.status(200).json({
            success: true,
            token: token,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                number: user.number,
                isEmailVerified: user.isEmailVerified
            },
            message: 'Login successful'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const getuserbyId = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
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


const toggleBookmark = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const { propertyId } = req.body;

        const index = user.bookmarks.indexOf(propertyId);

        if (index === -1) {
            user.bookmarks.push(propertyId);
        } else {
            user.bookmarks.splice(index, 1);
        }

        await user.save();

        res.json({
            success: true,
            bookmarks: user.bookmarks
        });

    } catch (err) {
        res.status(500).json({ message: "Error" });
    }
};

const getBookmarks = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'bookmarks',
            select: 'title description price address city state bedrooms bathrooms square_foot image parking postedBy'
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
        res.status(200).json({
            success: true,
            data: user.bookmarks
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

const sendQuery = async (req, res) => {
    const {
        sellerEmail,
        buyerName,
        buyerEmail,
        buyerPhone,
        propertyTitle,
        message,
        propertyId,
        sellerId
    } = req.body;


    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: sellerEmail,
            subject: `Query for ${propertyTitle}`,
            replyTo: buyerEmail,
            text: `
Property: ${propertyTitle}

Buyer:
Name: ${buyerName}
Email: ${buyerEmail}
Phone: ${buyerPhone}

Message:
${message}
      `
        });

        const newQuery = await Query.create({
            property: propertyId,
            seller: sellerId,
            buyer: req.user.id, // from JWT middleware
            message: message
        });

        res.json({
            success: true,
            msg: "Query sent",
            data: newQuery
        });

    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

const getQueries = async (req, res) => {
    try {
        const queries = await Query.find({ buyer: req.user.id })
            .populate("property", "title")
            .populate("seller", "name email");

        res.json(queries);
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: err.message
        });
    }
};

const updateAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        const avatarUrl = req.file.path;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { avatar: avatarUrl },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: user,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


const userController = {
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

}

module.exports = userController;
