require('dotenv').config();
const sequelize = require('../src/config/database');

async function createTables() {
  try {
    await sequelize.query(`
      CREATE EXTENSION IF NOT EXISTS pgcrypto;

      CREATE TABLE IF NOT EXISTS "Polls" (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        question VARCHAR(500) NOT NULL,
        options JSONB NOT NULL,
        teacher_id UUID NOT NULL REFERENCES "Users"(id),
        is_active BOOLEAN DEFAULT true,
        end_time TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS "Votes" (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        poll_id UUID NOT NULL REFERENCES "Polls"(id) ON DELETE CASCADE,
        option_index INTEGER NOT NULL,
        voter_session VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(poll_id, voter_session)
      );
    `);

    console.log('✅ Polls and Votes tables created or already exist');
    process.exit(0);
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }
}

createTables();
