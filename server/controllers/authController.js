const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Tenant, User } = require('../models/Schemas');

exports.registerTenant = async (req, res) => {
    const { shopName, name, email, password } = req.body;
    try {
        let userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ msg: "User already exists" });

        const tenant = new Tenant({ 
            name: shopName, 
            slug: shopName.toLowerCase().split(' ').join('-') 
        });
        await tenant.save();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name, email, password: hashedPassword,
            tenantId: tenant._id, role: 'Admin'
        });
        await user.save();

        res.status(201).json({ msg: "Shop and Admin created." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).populate('tenantId');
        if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

        const payload = { 
            id: user._id, 
            tenantId: user.tenantId._id, 
            role: user.role 
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) throw err;
            
            // ✅ MODIFY THIS LINE: Send user details so frontend can see the Role
            res.json({ 
                token, 
                user: { 
                    name: user.name, 
                    role: user.role, 
                    shopName: user.tenantId.name 
                } 
            });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Admin adds a Staff member
exports.addStaff = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        // 1. Only Admins should be allowed to add staff (we will handle this with middleware)
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ msg: "Only Admins can add staff" });
        }

        let userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ msg: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newStaff = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'Staff', // Manager or Staff
            tenantId: req.user.tenantId // Automatically assign the Admin's Shop ID
        });

        await newStaff.save();
        res.status(201).json({ msg: `New ${role} added to your shop!` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};