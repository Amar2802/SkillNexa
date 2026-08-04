import roadmaps from "../data/roadmapData.js";
import User from "../models/User.js";

// Serve the roadmap structure
export const getRoadmaps = async (req, res) => {
  try {
    // Calculate total topics in the whole curriculum for completion percentages
    let totalTopicsCount = 0;
    roadmaps.forEach((roadmap) => {
      totalTopicsCount += roadmap.topics.length;
    });

    const userCompleted = req.user.completedRoadmapTopics || [];
    const overallCompletion = totalTopicsCount > 0 
      ? Math.round((userCompleted.length / totalTopicsCount) * 100)
      : 0;

    res.json({
      roadmaps,
      completedRoadmapTopics: userCompleted,
      overallCompletion
    });
  } catch (error) {
    console.error("getRoadmaps error:", error.message || error);
    res.status(500).json({ message: "Unable to retrieve roadmap data." });
  }
};

// Toggle completion of a specific topic node
export const toggleTopicComplete = async (req, res) => {
  const { topicId } = req.body; // expected format "subjectId:topicName"
  if (!topicId) {
    return res.status(400).json({ message: "topicId is required." });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const completed = user.completedRoadmapTopics || [];
    const exists = completed.includes(topicId);

    user.completedRoadmapTopics = exists
      ? completed.filter((id) => id !== topicId)
      : [...completed, topicId];

    await user.save();

    let totalTopicsCount = 0;
    roadmaps.forEach((roadmap) => {
      totalTopicsCount += roadmap.topics.length;
    });

    const overallCompletion = totalTopicsCount > 0 
      ? Math.round((user.completedRoadmapTopics.length / totalTopicsCount) * 100)
      : 0;

    res.json({
      success: true,
      completedRoadmapTopics: user.completedRoadmapTopics,
      overallCompletion
    });
  } catch (error) {
    console.error("toggleTopicComplete error:", error.message || error);
    res.status(500).json({ message: "Error updating completed topic status." });
  }
};
