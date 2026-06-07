const { Op } = require('sequelize')
const Poll = require('../models/Poll')

const startPollScheduler = (io) => {
  console.log('⏰ Poll scheduler started')

  // Check every minute for expired polls
  setInterval(async () => {
    try {
      const now = new Date()

      // Find all active polls that have passed end_time
      const expiredPolls = await Poll.findAll({
        where: {
          is_active: true,
          end_time: {
            [Op.not]: null,
            [Op.lt]: now  // end_time is in the past
          }
        }
      })

      if (expiredPolls.length === 0) return

      console.log(`⏰ Found ${expiredPolls.length} expired polls`)

      for (const poll of expiredPolls) {
        // Deactivate the poll
        await poll.update({ is_active: false })
        console.log(`✅ Poll expired and deactivated: ${poll.question}`)

        // Notify all students and teacher via WebSocket
        if (io) {
          io.to('public_dashboard').emit('poll_expired', {
            pollId: poll.id,
            message: `Poll "${poll.question}" has ended`
          })
          io.to(`teacher_${poll.teacher_id}`).emit('poll_expired', {
            pollId: poll.id,
            message: `Your poll "${poll.question}" has ended`
          })
        }
      }
    } catch (error) {
      console.error('Poll scheduler error:', error.message)
    }
  }, 60 * 1000) // runs every 60 seconds
}

module.exports = { startPollScheduler }