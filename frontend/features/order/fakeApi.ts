import { faker } from "@faker-js/faker";
import { OrderStatus, orderStatus } from "./dto";
import { v4 as uuidv4 } from "uuid";

const generateSampleOrders = (count = 100) => {
  const clients = [
    "Nguyễn Văn",
    "Trần Thị",
    "Lê Văn",
    "Phạm Thị",
    "Ngô Văn",
    "Vũ Thị",
    "Đặng Văn",
    "Hoàng Thị",
    "Bùi Văn",
    "Đỗ Thị",
  ];
  const packages = [
    "Professional Logo Design",
    "Document Translation",
    "Ad Banner Design",
    "Video Editing",
    "UX/UI App Design",
    "SEO Consulting",
    "Website Design",
    "Social Media Management",
    "Mobile App Development",
    "Brochure Design",
  ];

  const orders = [];

  for (let i = 1; i <= count; i++) {
    const client = `${clients[Math.floor(Math.random() * clients.length)]} ${String.fromCharCode(65 + (i % 26))}`;
    const packageName = packages[Math.floor(Math.random() * packages.length)];
    const status = orderStatus[Math.floor(Math.random() * orderStatus.length)];
    const deadline = new Date(
      Date.now() + Math.floor(Math.random() * 30) * 86400000,
    )
      .toISOString()
      .split("T")[0];

    const a = Date.now() + Math.floor(Math.random() * 30) * 86400000;
    orders.push({
      id: faker.person,
      client,
      package: packageName,
      status,
      deadline,
      price: faker.number.int({ min: 100, max: 2000 }),

      createdAt: new Date(a).toISOString(),
    });
  }

  return orders;
};

// export enum OrderStatus {
//   PENDING = "PENDING",
//   PAID = "PAID",
//   IN_PROGRESS = "IN_PROGRESS",
//   DELIVERED = "DELIVERED",
//   COMPLETED = "COMPLETED",
//   CANCELED = "CANCELED",
//   REFUNDED = "REFUNDED",
// }

function generateFakeOrder(requredOrderStatus: OrderStatus[]): any {
  const packageId = uuidv4();
  const features = [
    { value: "Yes", package: "Functional website" },
    {
      value: faker.number.int({ min: 1, max: 10 }).toString(),
      package: "Pages",
    },
    { value: "Yes", package: "Responsive design" },
    { value: "Yes", package: "Content upload" },
    {
      value: faker.number.int({ min: 1, max: 10 }).toString(),
      package: "Plugins/extention",
    },
    { value: faker.datatype.boolean() ? "Yes" : "", package: "Product" },
    {
      value: faker.datatype.boolean() ? "Yes" : "",
      package: "Payment Integration",
    },
    {
      value: faker.datatype.boolean() ? "Yes" : "",
      package: "Autoresponder integration",
    },
  ];

  const deliveryTime = faker.number.int({ min: 2, max: 14 });
  const price = faker.number.int({ min: 50, max: 500 });
  const quantity = faker.number.int({ min: 1, max: 3 });
  const totalAmount = price * quantity;

  return {
    createdAt: faker.date.recent({ days: 100 }).toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    deletedAt: null,
    id: uuidv4(),
    buyerId: uuidv4(),
    buyerName: faker.person.fullName(),
    freelancerId: uuidv4(),
    gigId: uuidv4(),
    gigTitle: faker.commerce.productName(),
    packageId,
    currency: "USD",
    price,
    quantity,
    totalAmount,
    requirements: faker.datatype.boolean() ? faker.lorem.sentences(2) : null,
    deliveryTime,
    status: faker.helpers.arrayElement(requredOrderStatus ?? orderStatus),
    deadline: faker.date.soon({ days: 90 }).toISOString().split("T")[0],
    snapshot: {
      id: packageId,
      type: faker.helpers.arrayElement(["basic", "standard", "premium"]),
      price,
      title: faker.commerce.productName(),
      features,
      createdAt: faker.date.recent({ days: 1000 }).toISOString(),
      deletedAt: null,
      revisions: faker.number.int({ min: 1, max: 5 }),
      updatedAt: faker.date.recent().toISOString(),
      description: faker.commerce.productDescription(),
      deliveryTime,
    },
  };
}

export const fetchOrders = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      //    const orders = generateSampleOrders(300);
      const fakeOrders = Array.from({ length: 500 }, generateFakeOrder);

      resolve(fakeOrders);
    }, 1500);
  });
};

export const fetchFreelancersOrders = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      //    const orders = generateSampleOrders(300);
      const fakeOrders = Array.from({ length: 500 }, () =>
        generateFakeOrder([
          OrderStatus.PENDING,
          OrderStatus.IN_PROGRESS,
          OrderStatus.DELIVERED,
          OrderStatus.COMPLETED,
          OrderStatus.CANCELED,
        ]),
      );

      resolve(fakeOrders);
    }, 1500);
  });
};

export const fetchOrderById = async (id: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        client: `Nguyễn Văn ${id}`,
        package: "Professional Logo Design",
        status: "IN_PROGRESS",
        deadline: "2025-04-30",
        description: "Thiết kế logo cao cấp với concept độc đáo.",
        price: faker.number.int({ min: 100, max: 2000 }),
        attachments: [],
        tags: ["Thiết kế", "Logo"],
      });
    }, 1000);
  });
};
