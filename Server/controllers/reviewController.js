import ProductModel from "../models/product.js";
import OrderModel from "../models/order.js";

const reviewAdd = async (req, res) => {
  const { orderId, reviews, deliveryReview, deliveryRating } = req.body;
  console.log("POST: ", orderId,reviews, deliveryReview, deliveryRating);
  try {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }
    if (order.reviewed) {
      return res.status(400).json({ success: false, message: "Order already reviewed." });
    }
    if (typeof deliveryRating !== "number" || deliveryRating < 1 || deliveryRating > 5) {
      return res.status(400).json({ success: false, message: "Invalid delivery rating. Must be a number between 1 and 5." });
    }

    // Update delivery review and rating
    order.deliveryReview = (deliveryReview || "").trim();
    order.deliveryRating = Number(deliveryRating);

    // Update product reviews
    if (reviews && Array.isArray(reviews)) {
      for (const { productId, rating } of reviews) {
        if (!productId || typeof rating !== "number" || rating < 1 || rating > 5) {
          continue; // Skip invalid entries
        }

        const product = await ProductModel.findById(productId);
        if (product) {
          // Add the new rating
          product.ratings.push(rating);

          // Calculate the average rating directly
          const totalRatings = product.ratings.length;
          const sumOfRatings = product.ratings.reduce((sum, current) => sum + current, 0);

          // Average = Total Sum of Ratings / Number of Ratings
          product.averageRating = totalRatings > 0 ? sumOfRatings / totalRatings : 0;

          // Save the updated product document
          await product.save();
        }
      }
    }

    order.reviewed = true;
    await order.save();

    res.status(200).json({ success: true, message: "Reviews submitted successfully." });
  } catch (error) {
    console.error("Error adding reviews:", {
      error: error.message,
      stack: error.stack,
      requestBody: req.body,
    });
    res.status(500).json({ success: false, message: "An internal error occurred." });
  }
};

export { reviewAdd };