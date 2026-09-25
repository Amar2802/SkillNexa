import Notification from "../models/Notification.js";
import Result from "../models/Result.js";

export const getNotifications = async (req, res) => {
  try {
    let notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    // If user has no notifications yet, generate genuine initial notifications from their authentic state
    if (notifications.length === 0) {
      const initialItems = [
        {
          user: req.user._id,
          title: "Welcome to SkillNexa",
          message: "Explore curated problems, full-length mock tests, and AI interview simulations tailored for your career.",
          type: "system",
          link: "/dashboard",
          read: false
        }
      ];

      if (req.user.streakCount > 0) {
        initialItems.push({
          user: req.user._id,
          title: `${req.user.streakCount}-Day Streak Active!`,
          message: `Great momentum! You've kept your practice streak alive for ${req.user.streakCount} consecutive days.`,
          type: "achievement",
          link: "/analytics",
          read: false
        });
      }

      if (req.user.progress?.testsTaken > 0) {
        initialItems.push({
          user: req.user._id,
          title: "Mock Assessment Performance",
          message: `You have completed ${req.user.progress.testsTaken} mock test(s). Check your detailed question review to optimize weak areas.`,
          type: "test",
          link: "/mock-tests",
          read: false
        });
      }

      if (req.user.completedRoadmapTopics?.length > 0) {
        initialItems.push({
          user: req.user._id,
          title: "Roadmap Milestones",
          message: `You've conquered ${req.user.completedRoadmapTopics.length} roadmap topic(s). Keep advancing your core technical competencies.`,
          type: "practice",
          link: "/roadmaps",
          read: false
        });
      }

      await Notification.insertMany(initialItems);
      notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    }

    const unreadCount = notifications.filter((n) => !n.read).length;

    res.json({
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error("getNotifications error:", error.message || error);
    res.status(500).json({ message: "Failed to load notifications" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const unreadCount = await Notification.countDocuments({ user: req.user._id, read: false });

    res.json({
      success: true,
      notification,
      unreadCount
    });
  } catch (error) {
    console.error("markAsRead error:", error.message || error);
    res.status(500).json({ message: "Failed to update notification" });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { $set: { read: true } }
    );

    res.json({
      success: true,
      unreadCount: 0
    });
  } catch (error) {
    console.error("markAllAsRead error:", error.message || error);
    res.status(500).json({ message: "Failed to mark all as read" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!deleted) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const unreadCount = await Notification.countDocuments({ user: req.user._id, read: false });

    res.json({
      success: true,
      unreadCount
    });
  } catch (error) {
    console.error("deleteNotification error:", error.message || error);
    res.status(500).json({ message: "Failed to delete notification" });
  }
};

export const clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user._id });

    res.json({
      success: true,
      unreadCount: 0
    });
  } catch (error) {
    console.error("clearAllNotifications error:", error.message || error);
    res.status(500).json({ message: "Failed to clear notifications" });
  }
};
