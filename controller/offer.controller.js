import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

// Get Smart Offers for User: /api/offer/smart
export const getSmartOffers = async (req, res) => {
    try {
        const userId = req.user;

        // 1. Fetch User Order History (paid or COD)
        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }],
        }).populate("items.product");

        if (!orders || orders.length === 0) {
            return res.status(200).json({ success: true, offers: [] });
        }

        // 2. Analyze Purchase Patterns
        const productFrequency = {};
        const categoryFrequency = {};

        orders.forEach((order) => {
            order.items.forEach((item) => {
                // Handle if product was populated or not (safe check)
                const product = item.product;
                if (!product) return;

                // Count Product Frequency
                const productId = product._id.toString();
                productFrequency[productId] = (productFrequency[productId] || 0) + item.quantity;

                // Count Category Frequency
                if (product.category) {
                    categoryFrequency[product.category] = (categoryFrequency[product.category] || 0) + item.quantity;
                }
            });
        });

        const offers = [];

        // 3. Generate Product Discounts (Recurring buys)
        // Threshold: Bought at least 2 times
        for (const [productId, count] of Object.entries(productFrequency)) {
            if (count >= 2) {
                const product = await Product.findById(productId);
                if (product && product.inStock) {
                    offers.push({
                        type: "discount",
                        title: `10% Off on your favorite ${product.name}`,
                        description: `You've bought this ${count} times! Here's a special deal.`,
                        product: product,
                        discountPercentage: 10,
                        id: `OFFER_DISC_${productId}`
                    });
                }
            }
        }

        // 4. Generate Category Combos (Category lovers)
        // Threshold: Bought at least 3 items from a category
        // In a real app, we'd lookup a specific Bundle for this category. 
        // For now, we'll create a generic "Smart Suggestion" or find a product they HAVEN'T bought yet in that category.
        for (const [category, count] of Object.entries(categoryFrequency)) {
            if (count >= 3) {
                // Find a popular product in this category they might like
                const recommendation = await Product.findOne({ category });

                if (recommendation) {
                    offers.push({
                        type: "combo",
                        title: `${category} Lover Special`,
                        description: `You love ${category}! Check out this special deal.`,
                        product: recommendation, // directing to a product for now, could be a bundle
                        discountPercentage: 5,
                        id: `OFFER_CAT_${category}`
                    })
                }
            }
        }

        // Limit offers to avoiding overwhelming the UI
        const finalOffers = offers.slice(0, 4);

        res.status(200).json({ success: true, offers: finalOffers });

    } catch (error) {
        console.error("Error fetching smart offers:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
