const { Op } = require('sequelize');
const Content = require('../models/Content');

/**
 * Get currently active content for a teacher
 * Rotation logic: each subject rotates content based on duration
 */
const getActiveContent = async (teacherId) => {
  const now = new Date();

  // Get all approved content for this teacher within time window
  const approvedContent = await Content.findAll({
    where: {
      uploaded_by: teacherId,
      status: 'approved',
      start_time: { [Op.lte]: now },
      end_time: { [Op.gte]: now }
    },
    order: [['created_at', 'ASC']]
  });

  if (!approvedContent.length) return null;

  // Group content by subject
  const subjectGroups = {};
  approvedContent.forEach(content => {
    if (!subjectGroups[content.subject]) {
      subjectGroups[content.subject] = [];
    }
    subjectGroups[content.subject].push(content);
  });

  // For each subject, determine which content is currently active
  const activeContentPerSubject = {};

  for (const subject in subjectGroups) {
    const contents = subjectGroups[subject];
    const active = getRotatingContent(contents, now);
    if (active) {
      activeContentPerSubject[subject] = active;
    }
  }

  return activeContentPerSubject;
};

/**
 * Rotation logic:
 * - Calculate total cycle duration (sum of all content durations)
 * - Find where current time falls in the cycle
 * - Return the content that should be active right now
 */
const getRotatingContent = (contents, now) => {
  if (contents.length === 1) return contents[0];

  // Total cycle = sum of all rotation durations (in ms)
  const totalCycleMs = contents.reduce((sum, c) => {
    return sum + (c.rotation_duration || 5) * 60 * 1000;
  }, 0);

  // Use the earliest start_time as cycle anchor
  const cycleStart = new Date(
    Math.min(...contents.map(c => new Date(c.start_time).getTime()))
  );

  // How far into the current cycle are we?
  const elapsedMs = (now.getTime() - cycleStart.getTime()) % totalCycleMs;

  // Walk through contents to find which one is active
  let cursor = 0;
  for (const content of contents) {
    const durationMs = (content.rotation_duration || 5) * 60 * 1000;
    if (elapsedMs >= cursor && elapsedMs < cursor + durationMs) {
      return content;
    }
    cursor += durationMs;
  }

  return contents[0]; // fallback
};

module.exports = { getActiveContent };