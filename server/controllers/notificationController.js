import Notification from '../models/Notification.js';

// @desc    Get current user's notifications + unread count
// @route   GET /api/notifications
// @access  Private
export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching notifications.',
    });
  }
};

// @desc    Mark a single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found.',
      });
    }

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating notification.',
    });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error marking all read.',
    });
  }
};

// @desc    Seed realistic demo notifications for the current user
// @route   POST /api/notifications/seed
// @access  Private
export const seedDemoNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    // Check if user already has notifications
    const existingCount = await Notification.countDocuments({ recipient: userId });
    if (existingCount > 0) {
      return res.status(200).json({
        success: true,
        message: 'User already has notifications.',
        count: existingCount,
      });
    }

    const demoItems = [
      {
        recipient: userId,
        senderName: 'National Tech University',
        title: 'University Adopted Your Challenge',
        message: 'Dr. Evelyn Vance and the Smart City Lab have adopted challenge SS-2026-000101.',
        type: 'status_change',
        link: '/problems/SS-2026-000101',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
      },
      {
        recipient: userId,
        senderName: 'Apex Green Technologies',
        title: 'Corporate Sponsorship Pledged',
        message: 'Apex Green pledged $12,500 in funding and IoT telemetry units for groundwater remediation.',
        type: 'sponsorship_pledged',
        link: '/problems/SS-2026-000101',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      },
      {
        recipient: userId,
        senderName: 'Prof. Ramesh K.',
        title: 'New Milestone Report Posted',
        message: 'Stage 5 Milestone: Pilot filtration sensor testing completed with 99.4% accuracy.',
        type: 'new_comment',
        link: '/problems/SS-2026-000101',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      },
      {
        recipient: userId,
        senderName: 'SocietySolve Governance',
        title: 'Institutional Verification Complete',
        message: 'Your account credentials have been verified with Tier-1 Academic & Civic accreditation.',
        type: 'verification',
        link: '/problems',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      },
    ];

    const created = await Notification.insertMany(demoItems);

    res.status(201).json({
      success: true,
      message: 'Demo notifications seeded successfully.',
      count: created.length,
    });
  } catch (error) {
    console.error('Error seeding notifications:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error seeding notifications.',
    });
  }
};
