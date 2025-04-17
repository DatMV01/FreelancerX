import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { GigStatus } from "./gig.types";

// Hàm tạo 1 gig mẫu
const createSampleGig = (): any => {
  const statuses = Object.values(GigStatus);
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

  return {
    id: uuidv4(),
    createdAt: faker.date.past({ years: 1 }).toUTCString(),
    updatedAt: faker.date.recent({ days: 100 }).toUTCString(),
    title: faker.company.catchPhrase(),
    category: "programming-tech",
    subCategory: "website-platform",
    nestedSubcategory: "shopify",
    tags: faker.helpers.arrayElements(
      ["react", "laravel", "shopify", "html", "php", "nextjs", "nodejs"],
      2,
    ),
    reviewCount: faker.number.int({ min: 0, max: 100 }),
    basicPrice: faker.number.int({ min: 100, max: 1000 }),
    standardPrice: faker.number.int({ min: 200, max: 1000 }),
    premiumPrice: faker.number.int({ min: 300, max: 1000 }),
    pricing: [],
    description: faker.lorem.paragraphs(4),
    faqs: [],
    images: {
      image1: {
        id: uuidv4(),
        url: faker.image.urlLoremFlickr({ category: "technology" }),
      },
      image2: {
        id: uuidv4(),
        url: faker.image.urlLoremFlickr({ category: "web" }),
      },
      image3: {
        id: uuidv4(),
        url: faker.image.urlLoremFlickr({ category: "app" }),
      },
    },
    documents: {},
    video: {
      id: uuidv4(),
      url: "http://localhost:3000/public/videos/sample.mp4",
    },
    status: randomStatus,
    thumbnail: {
      id: uuidv4(),
      url: faker.image.avatar(),
    },
    requirements: [],
    orderCount: faker.number.int({ min: 0, max: 50 }),
    ratingAverate: faker.number.float({ min: 3, max: 5, fractionDigits: 2 }),
    viewCount: faker.number.int({ min: 0, max: 1000 }),
    slug: faker.helpers.slugify(faker.company.catchPhrase()),
    seller: {
      id: uuidv4(),
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      about: faker.lorem.sentences(3),
      sellerLevel: faker.helpers.arrayElement(["new", "level1", "level2"]),
      rating: faker.number.float({ min: 3, max: 5, fractionDigits: 2 }),
      completedOrders: faker.number.int({ min: 0, max: 50 }),
      reviewCount: faker.number.int({ min: 0, max: 50 }),
      responseTime: faker.number.int({ min: 0, max: 24 }),
      availability: "available",
      languages: ["English", "French"],
      skills: ["React", "Node.js", "Laravel"],
      status: {
        id: 2,
        name: "PENDING_VERIFICATION",
      },
      avatar: faker.image.avatar(),
    },
  };
};

export const fetchFreelancerManageGigs = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sampleGigs = Array.from({ length: 100 }, () => createSampleGig());

      resolve(sampleGigs);
    }, 2000);
  });
};

export const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return new Date(date).toLocaleDateString("vi-VN", options);
};
