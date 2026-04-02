import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

// get seller dashboard stats: /api/seller/stats
export const getDashboardStats = async (req, res) => {
    try {
        const sellerId = req.seller;

        // Get seller's products count
        const totalProducts = await Product.countDocuments({ sellerId });

        // Get seller's orders (orders containing seller's products)
        const orders = await Order.find({
            "items.sellerId": sellerId,
        }).populate("items.product");

        // Calculate total revenue from seller's products
        let totalRevenue = 0;
        orders.forEach((order) => {
            order.items.forEach((item) => {
                if (item.sellerId && item.sellerId.toString() === sellerId) {
                    const product = item.product;
                    if (product) {
                        totalRevenue += product.offerPrice * item.quantity;
                    }
                }
            });
        });

        res.status(200).json({
            success: true,
            stats: {
                totalProducts,
                totalOrders: orders.length,
                totalRevenue: Math.floor(totalRevenue * 100) / 100,
            },
        });
    } catch (error) {
        console.error("Error in getDashboardStats:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

// get seller products: /api/seller/products
export const getSellerProducts = async (req, res) => {
    try {
        const sellerId = req.seller;
        const products = await Product.find({ sellerId });

        res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        console.error("Error in getSellerProducts:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

// add product: /api/seller/products/add
export const addProduct = async (req, res) => {
    try {
        const sellerId = req.seller;
        const { name, description, price, offerPrice, image, category, inStock } = req.body;

        if (!name || !description || !price || !offerPrice || !image || !category) {
            return res.status(400).json({
                message: "Please fill all required fields",
                success: false,
            });
        }

        const product = new Product({
            name,
            description,
            price,
            offerPrice,
            image,
            category,
            inStock: inStock !== undefined ? inStock : true,
            sellerId,
        });

        await product.save();

        res.status(201).json({
            message: "Product added successfully",
            success: true,
            product,
        });
    } catch (error) {
        console.error("Error in addProduct:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

// update product: /api/seller/products/:id
export const updateProduct = async (req, res) => {
    try {
        const sellerId = req.seller;
        const { id } = req.params;
        const { name, description, price, offerPrice, image, category, inStock } = req.body;

        const product = await Product.findOne({ _id: id, sellerId });

        if (!product) {
            return res.status(404).json({
                message: "Product not found or you don't have permission to edit it",
                success: false,
            });
        }

        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = price;
        if (offerPrice) product.offerPrice = offerPrice;
        if (image) product.image = image;
        if (category) product.category = category;
        if (inStock !== undefined) product.inStock = inStock;

        await product.save();

        res.status(200).json({
            message: "Product updated successfully",
            success: true,
            product,
        });
    } catch (error) {
        console.error("Error in updateProduct:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

// delete product: /api/seller/products/:id
export const deleteProduct = async (req, res) => {
    try {
        const sellerId = req.seller;
        const { id } = req.params;

        const product = await Product.findOne({ _id: id, sellerId });

        if (!product) {
            return res.status(404).json({
                message: "Product not found or you don't have permission to delete it",
                success: false,
            });
        }

        await Product.findByIdAndDelete(id);

        res.status(200).json({
            message: "Product deleted successfully",
            success: true,
        });
    } catch (error) {
        console.error("Error in deleteProduct:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

// get seller orders: /api/seller/orders
export const getSellerOrders = async (req, res) => {
    try {
        const sellerId = req.seller;

        const orders = await Order.find({
            "items.sellerId": sellerId,
        })
            .populate("items.product")
            .populate("userId", "name email")
            .populate("address")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error("Error in getSellerOrders:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

// update order status: /api/seller/orders/:id/status
export const updateOrderStatus = async (req, res) => {
    try {
        const sellerId = req.seller;
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                message: "Status is required",
                success: false,
            });
        }

        const order = await Order.findOne({
            _id: id,
            "items.sellerId": sellerId,
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found or you don't have permission to update it",
                success: false,
            });
        }

        order.status = status;
        await order.save();

        res.status(200).json({
            message: "Order status updated successfully",
            success: true,
            order,
        });
    } catch (error) {
        console.error("Error in updateOrderStatus:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};
