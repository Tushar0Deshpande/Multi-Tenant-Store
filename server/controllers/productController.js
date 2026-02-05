const { Product } = require('../models/Schemas');

// Get all products for the logged-in store
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find({ tenantId: req.user.tenantId });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
};

exports.addProduct = async (req, res) => {
    // Destructure data from React frontend
    const { name, price, stock } = req.body;
    
    try {
        const newProduct = new Product({
            name,
            price: Number(price), // Convert to number to be safe
            stock: Number(stock), // Convert to number to be safe
            tenantId: req.user.tenantId // Taken from the JWT via middleware
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ error: "Could not add product" });
    }
};
exports.deleteProduct = async (req, res) => {
    try {
        // Find product by ID AND ensure it belongs to the user's tenant
        const product = await Product.findOneAndDelete({ 
            _id: req.params.id, 
            tenantId: req.user.tenantId 
        });

        if (!product) return res.status(404).json({ msg: "Product not found or unauthorized" });
        
        res.json({ msg: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
};