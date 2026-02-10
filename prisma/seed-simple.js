require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');

// Create PostgreSQL connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Initialize Prisma with pg adapter
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data (in development only)
  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    console.log('🧹 Cleaning existing data...');
    await prisma.audit.deleteMany();
    await prisma.commission.deleteMany();
    await prisma.ibRelation.deleteMany();
    await prisma.trade.deleteMany();
    await prisma.ledgerEntry.deleteMany();
    await prisma.withdrawal.deleteMany();
    await prisma.deposit.deleteMany();
    await prisma.account.deleteMany();
    await prisma.client.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
    await prisma.broker.deleteMany();
  }

  // Create default broker
  console.log('🏢 Creating default broker...');
  const defaultBroker = await prisma.broker.create({
    data: {
      name: 'Fizmo Trader',
      slug: 'fizmo-trader',
      domain: 'fizmo-alpha.vercel.app',
      status: 'ACTIVE',
      settings: {
        allowRegistration: true,
        requireEmailVerification: false,
        requireKyc: false,
      },
    },
  });
  console.log(`✅ Default broker created: ${defaultBroker.name}`);

  // Hash passwords
  const password = await bcrypt.hash('password123', 10);

  // Create Admin User
  console.log('👤 Creating admin user...');
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@fizmo.com',
      passwordHash: password,
      role: 'ADMIN',
      kycStatus: 'APPROVED',
      brokerId: defaultBroker.id,
    },
  });
  console.log(`✅ Admin created: ${adminUser.email}`);

  // Create Super Admin User
  console.log('👤 Creating super admin user...');
  const superAdmin = await prisma.user.create({
    data: {
      email: 'superadmin@fizmo.com',
      passwordHash: password,
      role: 'SUPER_ADMIN',
      kycStatus: 'APPROVED',
      brokerId: defaultBroker.id,
    },
  });
  console.log(`✅ Super Admin created: ${superAdmin.email}`);

  // Create Test Trader 1
  console.log('👤 Creating test trader 1...');
  const trader1 = await prisma.user.create({
    data: {
      email: 'trader1@example.com',
      passwordHash: password,
      role: 'CLIENT',
      kycStatus: 'APPROVED',
      brokerId: defaultBroker.id,
      client: {
        create: {
          clientId: 'CLT-000001',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+1 555-0101',
          country: 'USA',
          brokerId: defaultBroker.id,
          labels: ['VIP', 'Active'],
          metadata: {
            notes: 'High-value client',
          },
        },
      },
    },
    include: {
      client: true,
    },
  });

  if (trader1.client) {
    // Create accounts for trader1
    console.log('💼 Creating accounts for trader 1...');
    await prisma.account.create({
      data: {
        accountId: 'MT5-100001',
        clientId: trader1.client.id,
        accountType: 'LIVE',
        currency: 'USD',
        balance: 10000,
        equity: 10000,
        leverage: 100,
        status: 'ACTIVE',
      },
    });

    await prisma.account.create({
      data: {
        accountId: 'MT5-100002',
        clientId: trader1.client.id,
        accountType: 'DEMO',
        currency: 'USD',
        balance: 50000,
        equity: 50000,
        leverage: 500,
        status: 'ACTIVE',
      },
    });
  }
  console.log(`✅ Trader 1 created: ${trader1.email}`);

  // Create Test Trader 2
  console.log('👤 Creating test trader 2...');
  const trader2 = await prisma.user.create({
    data: {
      email: 'trader2@example.com',
      passwordHash: password,
      role: 'CLIENT',
      kycStatus: 'PENDING',
      brokerId: defaultBroker.id,
      client: {
        create: {
          clientId: 'CLT-000002',
          firstName: 'Jane',
          lastName: 'Smith',
          phone: '+1 555-0102',
          country: 'UK',
          brokerId: defaultBroker.id,
          labels: ['Active'],
          metadata: {},
        },
      },
    },
    include: {
      client: true,
    },
  });

  if (trader2.client) {
    // Create account for trader2
    console.log('💼 Creating account for trader 2...');
    await prisma.account.create({
      data: {
        accountId: 'MT5-100003',
        clientId: trader2.client.id,
        accountType: 'LIVE',
        currency: 'USD',
        balance: 5000,
        equity: 5000,
        leverage: 200,
        status: 'ACTIVE',
      },
    });
  }
  console.log(`✅ Trader 2 created: ${trader2.email}`);

  // Create Test IB
  console.log('👤 Creating test IB...');
  const ib = await prisma.user.create({
    data: {
      email: 'ib@example.com',
      passwordHash: password,
      role: 'IB',
      kycStatus: 'APPROVED',
      brokerId: defaultBroker.id,
      client: {
        create: {
          clientId: 'IB-000001',
          firstName: 'Bob',
          lastName: 'Johnson',
          phone: '+1 555-0103',
          country: 'USA',
          brokerId: defaultBroker.id,
          labels: ['IB Partner'],
          metadata: {
            ibLevel: 'Silver',
          },
        },
      },
    },
  });
  console.log(`✅ IB created: ${ib.email}`);

  // Create some audit logs
  console.log('📝 Creating audit logs...');
  await prisma.audit.createMany({
    data: [
      {
        actor: adminUser.id,
        action: 'USER_CREATED',
        target: trader1.id,
        payload: { role: 'CLIENT' },
      },
      {
        actor: adminUser.id,
        action: 'ACCOUNT_CREATED',
        target: 'MT5-100001',
        payload: { accountType: 'LIVE', balance: 10000 },
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log(`- 1 Broker created (${defaultBroker.name})`);
  console.log('- 5 Users created (1 Super Admin, 1 Admin, 2 Traders, 1 IB)');
  console.log('- 4 Clients created');
  console.log('- 3 Trading accounts created');
  console.log('- 2 Audit logs created');
  console.log('\n🔑 Login credentials (all users):');
  console.log('  Email: admin@fizmo.com');
  console.log('  Email: superadmin@fizmo.com');
  console.log('  Email: trader1@example.com');
  console.log('  Email: trader2@example.com');
  console.log('  Email: ib@example.com');
  console.log('  Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
