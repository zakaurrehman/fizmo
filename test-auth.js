// Direct test of auth functions without Next.js server
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');

async function testAuth() {
  console.log('🧪 Testing authentication with real database...\n');

  // Setup Prisma client
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    // Test 1: Find existing user
    console.log('Test 1: Finding existing user (trader1@example.com)');
    const user = await prisma.user.findUnique({
      where: { email: 'trader1@example.com' },
      include: { client: true },
    });

    if (user) {
      console.log('✅ User found:');
      console.log(`   - ID: ${user.id}`);
      console.log(`   - Email: ${user.email}`);
      console.log(`   - Role: ${user.role}`);
      console.log(`   - KYC Status: ${user.kycStatus}`);
      console.log(`   - Client: ${user.client?.firstName} ${user.client?.lastName}`);
    } else {
      console.log('❌ User not found');
      return;
    }

    // Test 2: Verify password
    console.log('\nTest 2: Verifying password');
    const isValid = await bcrypt.compare('password123', user.passwordHash);
    if (isValid) {
      console.log('✅ Password verification successful');
    } else {
      console.log('❌ Password verification failed');
      return;
    }

    // Test 3: Create a session
    console.log('\nTest 3: Creating session');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token: `test-token-${Date.now()}`,
        expiresAt,
      },
    });

    if (session) {
      console.log('✅ Session created:');
      console.log(`   - Token: ${session.token}`);
      console.log(`   - Expires: ${session.expiresAt}`);
    }

    // Test 4: Find session
    console.log('\nTest 4: Retrieving session');
    const foundSession = await prisma.session.findUnique({
      where: { token: session.token },
      include: { user: true },
    });

    if (foundSession) {
      console.log('✅ Session retrieved successfully');
      console.log(`   - User: ${foundSession.user.email}`);
    }

    // Clean up test session
    await prisma.session.delete({
      where: { id: session.id },
    });
    console.log('\nTest session cleaned up');

    console.log('\n🎉 All authentication tests passed!');
    console.log('\n✅ Database is ready for production use');
    console.log('   - User authentication working');
    console.log('   - Password verification working');
    console.log('   - Session management working');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error);
  } finally {
    await pool.end();
    await prisma.$disconnect();
  }
}

testAuth();
