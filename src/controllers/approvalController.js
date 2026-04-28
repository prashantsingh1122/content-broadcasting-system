const Content = require('../models/Content');

exports.getPendingContent = async (req, res) => {
  try {
    const contents = await Content.findAll({
      where: { status: 'pending' },
      order: [['created_at', 'DESC']]
    });

    res.json({ contents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllContent = async (req, res) => {
  try {
    const contents = await Content.findAll({
      order: [['created_at', 'DESC']]
    });

    res.json({ contents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.approveContent = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await Content.findByPk(id);
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    if (content.status !== 'pending') {
      return res.status(400).json({ error: 'Content already processed' });
    }

    content.status = 'approved';
    content.approved_by = req.user.id;
    content.approved_at = new Date();
    await content.save();

    res.json({ message: 'Content approved', content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.rejectContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ error: 'Rejection reason required' });
    }

    const content = await Content.findByPk(id);
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    if (content.status !== 'pending') {
      return res.status(400).json({ error: 'Content already processed' });
    }

    content.status = 'rejected';
    content.rejection_reason = reason;
    content.approved_by = req.user.id;
    await content.save();

    res.json({ message: 'Content rejected', content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
