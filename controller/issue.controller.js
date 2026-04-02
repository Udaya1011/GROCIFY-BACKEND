import Issue from "../models/issue.model.js";

// create an issue: /api/issue/create
export const createIssue = async (req, res) => {
    try {
        const userId = req.user;
        const { subject, description } = req.body;

        if (!subject || !description) {
            return res.status(400).json({
                success: false,
                message: "Subject and description are required",
            });
        }

        const issue = new Issue({
            userId,
            subject,
            description,
        });

        await issue.save();

        res.status(201).json({
            success: true,
            message: "Issue reported successfully",
            issue,
        });
    } catch (error) {
        console.error("Error in createIssue:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// get all issues for admin: /api/issue/admin/all
export const getAllIssues = async (req, res) => {
    try {
        const issues = await Issue.find({}).populate("userId", "name email").sort({ createdAt: -1 });
        res.status(200).json({ success: true, issues });
    } catch (error) {
        console.error("Error in getAllIssues:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// update issue status: /api/issue/admin/status
export const updateIssueStatus = async (req, res) => {
    try {
        const { id, status } = req.body;
        if (!id || !status) {
            return res.status(400).json({
                success: false,
                message: "Issue ID and status are required",
            });
        }

        const issue = await Issue.findByIdAndUpdate(id, { status }, { new: true }).populate("userId", "name email");
        if (!issue) {
            return res.status(404).json({ success: false, message: "Issue not found" });
        }

        // Send mock email if resolved or closed
        if (status === "Resolved" || status === "Closed") {
            await sendMockEmail({
                to: issue.userId.email,
                subject: `Grocify Support: Your issue has been ${status.toLowerCase()}`,
                text: `Hi ${issue.userId.name},\n\nWe are writing to inform you that your reported issue ("${issue.subject}") has been marked as ${status.toLowerCase()}.\n\nThank you for your patience!\n\nBest regards,\nGrocify Team`
            });
        }

        res.status(200).json({
            success: true,
            message: "Issue status updated successfully",
            issue,
        });
    } catch (error) {
        console.error("Error in updateIssueStatus:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
