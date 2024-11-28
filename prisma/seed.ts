const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Create a customer
  const customer = await prisma.customer.create({
    data: {
      name: 'Acme Corp',
      email: 'contact@acme.com',
      phone: '555-0123',
      address: '123 Business St',
    },
  })

  // Create a product
  const product = await prisma.product.create({
    data: {
      name: 'Custom LED Sign',
      type: 'LED',
      materialCost: 150.00,
      laborCost: 100.00,
      status: 'ACTIVE',
      stock: 5,
    },
  })

  // Create an order
  const order = await prisma.order.create({
    data: {
      customerId: customer.id,
      status: 'IN_PRODUCTION',
      totalAmount: 500.00,
      orderProducts: {
        create: {
          productId: product.id,
          quantity: 2,
          customization: 'Blue color, 24x36 inches',
        },
      },
    },
  })

  // Create a production stage
  const stage = await prisma.productionStage.create({
    data: {
      name: 'Initial Design',
      orderId: order.id,
      startDate: new Date(),
      status: 'IN_PROGRESS',
      description: 'Creating initial design mockups',
    },
  })

  // Create tasks for the stage
  await prisma.task.create({
    data: {
      name: 'Design Mockup',
      description: 'Create initial design mockup for client approval',
      status: 'IN_PROGRESS',
      stageId: stage.id,
      assignedTo: admin.id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
