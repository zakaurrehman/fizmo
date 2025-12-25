const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

// Setup database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function createSuperAdmin() {
  try {
    const email = 'zakarehmanai@gmail.com';
    const password = 'Trader.1212';

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('User already exists. Updating to SUPER_ADMIN role...');

      const updated = await prisma.user.update({
        where: { email },
        data: { role: 'SUPER_ADMIN' }
      });

      console.log('✓ User updated to SUPER_ADMIN:', updated.email);
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Get or create a default broker first
    let broker = await prisma.broker.findFirst({
      where: { slug: 'default' }
    });

    if (!broker) {
      console.log('Creating default broker...');
      broker = await prisma.broker.create({
        data: {
          name: 'Default Broker',
          slug: 'default',
          domain: 'localhost',
          status: 'ACTIVE'
        }
      });
      console.log('✓ Default broker created');
    }

    // Generate unique client ID
    const clientId = `SA${Date.now()}`;

    // Create user with client profile
    const user = await prisma.user.create({
      data: {
        brokerId: broker.id,
        email,
        passwordHash,
        role: 'SUPER_ADMIN',
        kycStatus: 'APPROVED',
        client: {
          create: {
            clientId,
            firstName: 'Super',
            lastName: 'Admin',
            phone: '',
            country: '',
            broker: {
              connect: { id: broker.id }
            }
          }
        }
      },
      include: {
        broker: true,
        client: true
      }
    });

    console.log('✓ SUPER_ADMIN user created successfully!');
    console.log('  Email:', user.email);
    console.log('  Role:', user.role);
    console.log('  Broker:', user.broker.name);
    console.log('\nYou can now login at: http://localhost:3000/login');

  } catch (error) {
    console.error('Error creating super admin:', error);
  } finally {
    await pool.end();
    await prisma.$disconnect();
  }
}

createSuperAdmin();
