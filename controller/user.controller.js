import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// register user: /api/user/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;
    if (!name || !email || !password || !mobile) {
      return res
        .status(400)
        .json({ message: "Please fill all the fields", success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
    });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict", // Prevent CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time (7 days)
    });
    res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: {
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
      token,
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// login user: /api/user/login

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all the fields", success: false });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User does not exist", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "Logged in successfull",
      success: true,
      user: {
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// check auth : /api/user/is-auth
export const checkAuth = async (req, res) => {
  try {
    const userId = req.user;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error in checkAuth:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// logout user: /api/user/logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
    });
    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// forgot password: /api/user/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Generate a random 6-digit token for demo (in production use a real library)
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // MOCK: Sending email
    console.log(`Password reset token for ${email}: ${resetToken}`);

    res.status(200).json({
      message: "Password reset token sent to email",
      success: true,
      token: resetToken // Returning token for easy testing in demo
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// reset password: /api/user/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    const user = await User.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token", success: false });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully", success: true });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// forgot password via OTP controller
export const forgotPasswordOTP = async (req, res) => {
  try {
    const { mobile, action, otp } = req.body;

    if (action === 'send') {
      const user = await User.findOne({ mobile });
      if (!user) {
        return res.json({ success: false, message: "User not found with this mobile number" });
      }

      // Mock OTP sending
      const generatedOtp = "654321"; // Static for demo
      console.log(`Reset OTP for ${mobile}: ${generatedOtp}`);

      return res.json({
        success: true,
        message: "OTP sent to your mobile number (Demo: 654321)"
      });
    }

    if (action === 'verify') {
      if (otp === "654321") {
        return res.json({ success: true, message: "OTP verified. You can now reset your password." });
      } else {
        return res.json({ success: false, message: "Invalid OTP" });
      }
    }

    res.status(400).json({ success: false, message: "Invalid action" });
  } catch (error) {
    console.error("Error in forgotPasswordOTP:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// reset password via OTP controller
export const resetPasswordOTP = async (req, res) => {
  try {
    const { mobile, otp, newPassword } = req.body;

    // Double check OTP for security in final step
    if (otp !== "654321") {
      return res.json({ success: false, message: "Unauthorized password reset attempt" });
    }

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: "Password reset successfully." });
  } catch (error) {
    console.error("Error in resetPasswordOTP:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// google login skeleton
export const googleLogin = async (req, res) => {
  try {
    // This would typically involve verifying a Google JWT from the frontend
    res.status(200).json({ message: "Google Login functionality coming soon!", success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// otp login controller
export const otpLogin = async (req, res) => {
  try {
    const { mobile, otp, action } = req.body;

    if (action === 'send') {
      // Mock: In production, use an SMS service like Twilio
      const generatedOtp = "123456"; // Static for demo
      console.log(`OTP for ${mobile}: ${generatedOtp}`);
      return res.status(200).json({
        message: "OTP sent successfully (Demo: 123456)",
        success: true
      });
    }

    if (action === 'verify') {
      if (otp === "123456") {
        // Find or create user
        let user = await User.findOne({ mobile });

        if (!user) {
          // For demo, if user doesn't exist, we might want them to register first 
          // or auto-create a basic profile. Let's assume they must exist for login.
          return res.status(404).json({ message: "User with this mobile not found. Please register first.", success: false });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
          message: "Logged in successfully with OTP",
          success: true,
          user: {
            name: user.name,
            email: user.email,
            mobile: user.mobile,
          },
        });
      } else {
        return res.status(400).json({ message: "Invalid OTP", success: false });
      }
    }

    res.status(400).json({ message: "Invalid action", success: false });
  } catch (error) {
    console.error("Error in otpLogin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
