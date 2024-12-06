const { PrismaClient, UserRole, TaskStatus, ProductionStageStatus } = require('@prisma/client')
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
      role: UserRole.ADMIN,
    },
  })

  // Create manager user
  const managerPassword = await hash('manager123', 10)
  const manager = await prisma.user.create({
    data: {
      email: 'manager@example.com',
      name: 'Manager User',
      password: managerPassword,
      role: UserRole.MANAGER,
    },
  })

  // Create worker user
  const workerPassword = await hash('worker123', 10)
  const worker = await prisma.user.create({
    data: {
      email: 'worker@example.com',
      name: 'Worker User',
      password: workerPassword,
      role: UserRole.WORKER,
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
      description: 'High-quality LED sign with customizable options',
      type: 'LED',
      materialCost: 150.00,
      laborCost: 100.00,
      price: 325.00, // (materialCost + laborCost) * 1.3
      status: 'ACTIVE',
      stock: 5,
    },
  })

  // Create production stages
  const stages = await Promise.all([
    prisma.productionStage.create({
      data: {
        name: 'Design',
        description: 'Create design based on customer requirements',
        orderNumber: 1,
        status: ProductionStageStatus.PLANNED,
      },
    }),
    prisma.productionStage.create({
      data: {
        name: 'Material Preparation',
        description: 'Prepare required materials and components',
        orderNumber: 2,
        status: ProductionStageStatus.PLANNED,
      },
    }),
    prisma.productionStage.create({
      data: {
        name: 'Assembly',
        description: 'Assemble the product components',
        orderNumber: 3,
        status: ProductionStageStatus.PLANNED,
      },
    }),
    prisma.productionStage.create({
      data: {
        name: 'Quality Check',
        description: 'Verify product quality and functionality',
        orderNumber: 4,
        status: ProductionStageStatus.PLANNED,
      },
    }),
  ])

  // Create an order
  const order = await prisma.order.create({
    data: {
      customerId: customer.id,
      status: 'IN_PRODUCTION',
      totalAmount: 650.00,
      notes: 'Rush order - needed by end of month',
      orderProducts: {
        create: {
          productId: product.id,
          quantity: 2,
          price: 325.00,
          customization: 'Blue color, 24x36 inches',
        },
      },
    },
  })

  // Create tasks for the order
  await Promise.all(stages.map(stage =>
    prisma.task.create({
      data: {
        title: `${stage.name} for Order #${order.id}`,
        description: `Complete ${stage.name.toLowerCase()} phase for custom LED sign`,
        status: TaskStatus.PENDING,
        assignedToId: worker.id,
        productionStageId: stage.id,
        orderId: order.id,
      },
    })
  ))

  console.log('Database has been seeded. 🌱')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
