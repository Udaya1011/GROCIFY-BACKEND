import jwt from "jsonwebtoken";
export const authAdmin = async (req, res, next) => {
  const { adminToken } = req.cookies;
  if (!adminToken) {
    return res.status(401).json({ message: "Unauthorized", success: false });
  }
  try {
    const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);
    if (decoded.email === process.env.ADMIN_EMAIL) {
      return next();
    } else {
      return res.status(403).json({ message: "Forbidden", success: false });
    }
  } catch (error) {
    console.error("Error in authAdmin middleware:", error);
    return res.status(401).json({ message: "Invalid token", success: false });
  }
};
