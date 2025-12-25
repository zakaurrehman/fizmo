import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { Broker } from '@prisma/client';

/**
 * Get the current broker from request headers
 * This function should be called in Server Components and API routes
 */
export async function getCurrentBroker(): Promise<Broker | null> {
  const headersList = await headers();
  const brokerSlug = headersList.get('x-broker-slug');

  if (!brokerSlug) {
    return null;
  }

  // Special case for localhost/default
  if (brokerSlug === 'localhost' || brokerSlug === '127') {
    const broker = await prisma.broker.findFirst({
      where: { slug: 'default' },
    });
    return broker;
  }

  // Find broker by slug or domain
  const broker = await prisma.broker.findFirst({
    where: {
      OR: [
        { slug: brokerSlug },
        { domain: { contains: brokerSlug } },
      ],
      status: 'ACTIVE',
    },
  });

  return broker;
}

/**
 * Get the broker ID from request headers
 * Throws error if broker not found
 */
export async function requireBrokerId(): Promise<string> {
  const broker = await getCurrentBroker();

  if (!broker) {
    throw new Error('Broker not found');
  }

  return broker.id;
}

/**
 * Create a default broker if it doesn't exist
 * This is useful for initial setup
 */
export async function ensureDefaultBroker(): Promise<Broker> {
  const existing = await prisma.broker.findFirst({
    where: { slug: 'default' },
  });

  if (existing) {
    return existing;
  }

  return await prisma.broker.create({
    data: {
      name: 'Default Broker',
      slug: 'default',
      domain: 'localhost',
      status: 'ACTIVE',
      settings: {
        brandName: 'Fizmo Trader',
        supportEmail: 'support@fizmo.com',
      },
    },
  });
}
