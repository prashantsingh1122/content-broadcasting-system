require('dotenv').config();
const bcrypt = require('bcrypt');
const sequelize = require('../src/config/database');
const User = require('../src/models/User');

const seedUsers = async () => {
  await sequelize.sync({ force: false }); // never drop tables

  const hash = await bcrypt.hash('password123', 10);

  const users = [
    { name: 'Principal Smith', email: 'principal@school.com', password_hash: hash, role: 'principal' },
    { name: 'John Teacher',    email: 'john@school.com',      password_hash: hash, role: 'teacher'   },
    { name: 'Jane Teacher',    email: 'jane@school.com',      password_hash: hash, role: 'teacher'   }
  ];

  for (const user of users) {
    const exists = await User.findOne({ where: { email: user.email } });
    if (!exists) {
      await User.create(user);
      console.log('✅ Created:', user.email);
    } else {
      console.log('⏭️  Already exists:', user.email);
    }
  }

  console.log('\n✓ Seed complete!');
  console.log('Principal: principal@school.com / password123');
  console.log('Teacher 1: john@school.com / password123');
  console.log('Teacher 2: jane@school.com / password123');
  process.exit(0);
};

seedUsers().catch(e => { console.error(e.message); process.exit(1); });