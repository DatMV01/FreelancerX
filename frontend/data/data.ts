import { consoleLog } from "@/utils/console";

const programmingTechSubCategories = [
  {
    id: "8e2d1a7b-3c9f-4d5a-6b1e-2f7a4c8d3e9f",
    category_id: "3f1c9d2e-7b5a-4a8d-9e1c-2b7a1e5d3c4f",
    title: "Website Development",
    slug: "website-development",
    url: "/categories/programming-tech/website-development",
    description:
      "Create, build, and develop your website with skilled website developers",
    subCategories: [
      {
        id: "af0722a4-00c2-484e-b205-4d8527a78228",
        category_id: "8e2d1a7b-3c9f-4d5a-6b1e-2f7a4c8d3e9f",
        icon: "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/cb63c6dd487dc1630100243adea2913e-1727009044233/Python%20Developers.png",
        title: "Python Developers",
        slug: "python",
        url: "/categories/programming-tech/software-development/python",
        description:
          "Create professional Python based web applications with the help of freelance Python experts",
      },
      {
        id: "3cc198c5-7192-4d6c-b4d8-b062ee1c7b4d",
        category_id: "8e2d1a7b-3c9f-4d5a-6b1e-2f7a4c8d3e9f",
        icon: "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/8ab683c462bb7021359f813a67f0a210-1727008217020/HTML%20_%20CSS%20Developers.png",
        title: "HTML & CSS Developers",
        slug: "html-css",
        url: "/categories/programming-tech/software-development/html-css",
        description:
          "Find the best HTML & CSS developers services you need to help you successfully meet your project planning goals and deadline",
      },

      {
        id: "9656aec9-8c36-4c07-98a2-bc37fdd5ff63",
        category_id: "8e2d1a7b-3c9f-4d5a-6b1e-2f7a4c8d3e9f",
        icon: "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/cb63c6dd487dc1630100243adea2913e-1727009044218/JavaScript%20Developers.png",
        title: "JavaScript Developers",
        slug: "javascript",
        url: "/categories/programming-tech/software-development/javascript",
        description:
          "Find the best JavaScript developers services you need to help you successfully meet your project planning goals and deadline",
      },
      {
        id: "b9f7c618-cc7a-4a63-a927-fd15e1a569ed",
        category_id: "8e2d1a7b-3c9f-4d5a-6b1e-2f7a4c8d3e9f",
        title: "Business Websites",
        slug: "business-websites",
        url: "/categories/programming-tech/website-development/business-websites",
      },
      {
        id: "7620a97b-8f5f-4d45-9a29-345b8e2c5752",
        category_id: "8e2d1a7b-3c9f-4d5a-6b1e-2f7a4c8d3e9f",
        title: "E-Commerce Development",
        slug: "e-commerce-development",
        url: "/categories/programming-tech/website-development/e-commerce-development",
      },
      {
        id: "5bda5b78-c8c0-4de1-95c1-e1a9b61c29ea",
        category_id: "8e2d1a7b-3c9f-4d5a-6b1e-2f7a4c8d3e9f",
        title: "Landing Pages",
        slug: "landing-pages",
        url: "/categories/programming-tech/website-development/landing-pages",
      },
      {
        id: "14f1b758-2a2b-4414-80d7-f76f4b1695a7",
        category_id: "8e2d1a7b-3c9f-4d5a-6b1e-2f7a4c8d3e9f",
        title: "Dropshipping Websites",
        slug: "dropshipping-websites",
        url: "/categories/programming-tech/website-development/dropshipping-websites",
      },
      {
        id: "acbe1f82-cfd8-4c1a-82fe-befde076ab0e",
        category_id: "8e2d1a7b-3c9f-4d5a-6b1e-2f7a4c8d3e9f",
        title: "Build a Complete Website",
        slug: "build-a-complete-website",
        url: "/categories/programming-tech/website-development/build-a-complete-website",
      },
    ],
  },
  {
    id: "d0739b2a-df3b-4cb2-8f80-7416a3e13c4a",
    category_id: "3f1c9d2e-7b5a-4a8d-9e1c-2b7a1e5d3c4f",
    title: "Website Platform",
    slug: "website-platform",
    url: "/categories/programming-tech/website-platform",
    subCategories: [
      {
        id: "afb9e093-b692-45a5-8d18-a25299e7e8f9",
        icon: "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/a4f23e7ad88e3c639e545e7f1ef6c24c-1727084447004/WordPress%20Developers.png",
        title: "WordPress Developers",
        slug: "wordpress",
        url: "/categories/programming-tech/website-platform/wordpress",
        description:
          "Find a freelance Wordpress development expert to build your WordPress website",
      },

      {
        id: "33594b0e-f360-46ea-9a00-94b417c819b2",
        icon: "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/148a459235c2efcccf74882dd6790246-1727083583518/Shopify%20Developers.png",
        title: "Shopify Developers",
        slug: "shopify",

        url: "/categories/programming-tech/website-platform/shopify",

        description: "Find a developer to build your Shopify site",
      },

      {
        id: "dede312d-6e9c-474d-92b9-85aa50650aa2",
        icon: "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/a4f23e7ad88e3c639e545e7f1ef6c24c-1727084447000/Wix%20Developers.png",
        title: "Wix Developers",
        slug: "wix",
        url: "/categories/programming-tech/website-platform/wix",
        description: "Find a developer to build your Wix site",
      },
      {
        id: "3f1d45e8-2d53-4c8e-9e9d-897d3c8f1b57",
        category_id: "d0739b2a-df3b-4cb2-8f80-7416a3e13c4a",
        title: "GoDaddy",
        slug: "go-daddy",
        url: "/categories/programming-tech/website-platform/go-daddy",
      },
    ],
  },
  {
    id: "8c2d3f5f-907d-4f98-b5b5-bc5a1c8b8d13",
    category_id: "3f1c9d2e-7b5a-4a8d-9e1c-2b7a1e5d3c4f",
    title: "Website Maintenance",
    subCategories: [
      {
        id: "33a74bc2-78b4-45e9-a8a9-5197d462abf5",
        category_id: "8c2d3f5f-907d-4f98-b5b5-bc5a1c8b8d13",
        title: "Website Customization",
        slug: "website-customization",
      },
      {
        id: "27db6e5f-93f9-4b26-82b9-13978b397a5e",
        category_id: "8c2d3f5f-907d-4f98-b5b5-bc5a1c8b8d13",
        title: "Bug Fixes",
        slug: "bug-fixes",
      },
      {
        id: "0f9b7d7d-e78e-4f63-a209-30368fbb0b83",
        category_id: "8c2d3f5f-907d-4f98-b5b5-bc5a1c8b8d13",
        title: "Backup & Migration",
        slug: "backup-migration",
      },
      {
        id: "c9d75a1e-2b49-49c9-b9b3-4bb2b2087b35",
        category_id: "8c2d3f5f-907d-4f98-b5b5-bc5a1c8b8d13",
        title: "Speed Optimization",
        slug: "speed-optimization",
      },
    ],
  },
  {
    id: "b8e4d703-9e6b-4f2f-a9a0-94d4f2643c6f",
    category_id: "3f1c9d2e-7b5a-4a8d-9e1c-2b7a1e5d3c4f",
    title: "AI Development",
    subCategories: [
      {
        id: "cdd32bfa-dcf7-4699-bc77-bf467c6ed7a4",
        category_id: "b8e4d703-9e6b-4f2f-a9a0-94d4f2643c6f",
        title: "AI Websites & Software",
        slug: "ai-websites-software",
      },
      {
        id: "5b4b7a34-9b8f-4b1b-b3e6-30f99eb10061",
        category_id: "b8e4d703-9e6b-4f2f-a9a0-94d4f2643c6f",
        title: "AI Mobile Apps",
        slug: "ai-mobile-apps",
      },
      {
        id: "b0a634f9-cd88-4198-a4bc-c65ad9f1e27e",
        category_id: "b8e4d703-9e6b-4f2f-a9a0-94d4f2643c6f",
        title: "AI Integrations",
        slug: "ai-integrations",
      },
      {
        id: "71c87f2e-9a31-4b55-b43e-c29b2b8762fc",
        category_id: "b8e4d703-9e6b-4f2f-a9a0-94d4f2643c6f",
        title: "AI Agents",
        slug: "ai-agents",
      },
      {
        id: "7fe47cd4-c76d-4f27-90c3-c1d8a93bba32",
        category_id: "b8e4d703-9e6b-4f2f-a9a0-94d4f2643c6f",
        title: "AI Fine-Tuning",
        slug: "ai-fine-tuning",
      },
      {
        id: "1119f032-c299-4403-9d1f-e63a06433b35",
        category_id: "b8e4d703-9e6b-4f2f-a9a0-94d4f2643c6f",
        title: "AI Technology Consulting",
        slug: "ai-technology-consulting",
      },
    ],
  },
  {
    id: "a2d98fc3-cb99-4655-9eaf-92cfb2134d84",
    category_id: "3f1c9d2e-7b5a-4a8d-9e1c-2b7a1e5d3c4f",
    title: "Chatbot Development",
    subCategories: [
      {
        id: "f97d0a92-30c1-4e7f-83c4-276acbce098e",
        category_id: "a2d98fc3-cb99-4655-9eaf-92cfb2134d84",
        title: "AI Chatbot",
        slug: "ai-chatbot",
      },
      {
        id: "d7b799b6-975f-49d3-a33d-5b462a7a9b87",
        category_id: "a2d98fc3-cb99-4655-9eaf-92cfb2134d84",
        title: "Rules Based Chatbot",
        slug: "rules-based-chatbot",
      },
      {
        id: "e68555d7-b48c-4007-8830-b57fe9f88ff0",
        category_id: "a2d98fc3-cb99-4655-9eaf-92cfb2134d84",
        title: "Discord",
        slug: "discord",
      },
      {
        id: "07dce4e0-12f7-497d-bb44-b7d4979efed0",
        category_id: "a2d98fc3-cb99-4655-9eaf-92cfb2134d84",
        title: "Telegram",
        slug: "telegram",
      },
    ],
  },
  {
    id: "8fefea57-cff4-4690-bba9-febcb87283b3",
    category_id: "3f1c9d2e-7b5a-4a8d-9e1c-2b7a1e5d3c4f",
    title: "Game Development",
    slug: "game-development",
    subCategories: [
      {
        id: "3ed72dfd-89ed-4685-a91c-cb47820c1578",
        category_id: "8fefea57-cff4-4690-bba9-febcb87283b3",
        title: "Gameplay Experience & Feedback",
        slug: "gameplay-experience-feedback",
      },
      {
        id: "54238f60-bc1b-4b59-a028-cd0977087cb9",
        category_id: "8fefea57-cff4-4690-bba9-febcb87283b3",
        title: "PC Games",
        slug: "pc-games",
      },
      {
        id: "c7f79b9d-b40b-4ac1-a9bb-d98adfc727ea",
        category_id: "8fefea57-cff4-4690-bba9-febcb87283b3",
        title: "Mobile Games",
        slug: "mobile-games",
      },
      {
        id: "bf90a7bf-ca86-42b6-bb33-9869ecc79182",
        icon: "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/148a459235c2efcccf74882dd6790246-1727083583542/Unity%20Developers.png",
        title: "Unity Developers",
        slug: "unity",
        url: "/categories/programming-tech/game-development/unity",
        description:
          "Find the best unity game developers services you need to help you successfully meet your project planning goals and deadline",
      },
    ],
  },
  {
    id: "ded4b34f-29a3-48f2-bbd5-101d42a6ecde",
    category_id: "3f1c9d2e-7b5a-4a8d-9e1c-2b7a1e5d3c4f",
    title: "Mobile App Development",
    subCategories: [
      {
        id: "1a57b82b-019b-44e6-9e8b-89d5b703e4ea",
        category_id: "ded4b34f-29a3-48f2-bbd5-101d42a6ecde",
        title: "Cross-platform Development",
        slug: "cross-platform-development",
        url: "/categories/software-development/mobile-app-development/cross-platform-development",
      },
      {
        id: "2d3a0e3d-157a-43bb-bbe6-5f06b4bb75b1",
        category_id: "ded4b34f-29a3-48f2-bbd5-101d42a6ecde",
        icon: "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/1857ea6cdffed9de2c5739f010338061-1727172011179/Android%20App%20Development.png",
        title: "Android App Developers",
        slug: "android",
        url: "/categories/software-development/mobile-app-development/android",
        description: "Go mobile with custom Android apps.",
      },
      {
        id: "ad63965a-5cc2-4520-8c5a-b5d08bc30f5f",
        category_id: "ded4b34f-29a3-48f2-bbd5-101d42a6ecde",
        icon: "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/1857ea6cdffed9de2c5739f010338061-1727172011194/iOS%20App%20Development.png",
        title: "iOS App Developers",
        slug: "ios",
        url: "/categories/software-development/mobile-app-development/ios",
        description: "Go mobile with custom iOS apps.",
      },
      {
        id: "d5c7db1f-f6d7-4b3b-a2c7-b8c5c25ec599",
        category_id: "ded4b34f-29a3-48f2-bbd5-101d42a6ecde",
        title: "Website to App",
        slug: "website-to-app",
        url: "/categories/software-development/mobile-app-development/website-to-app",
      },
      {
        id: "50ae8b27-b064-4c1f-a7e7-d0ebd30a2db6",
        category_id: "ded4b34f-29a3-48f2-bbd5-101d42a6ecde",
        title: "Mobile App Maintenance",
        slug: "mobile-app-maintenance",
        url: "/categories/software-development/mobile-app-development/mobile-app-maintenance",
      },
      {
        id: "1897200f-88b5-4c7c-b9e9-e3f0f83ed2d0",
        category_id: "ded4b34f-29a3-48f2-bbd5-101d42a6ecde",
        title: "VR & AR Development",
        slug: "vr-ar-development",
        url: "/categories/software-development/mobile-app-development/vr-ar-development",
      },
    ],
  },
  {
    id: "76bfc0a1-b62d-497a-b5a4-e6ea1c033ff0",
    category_id: "3f1c9d2e-7b5a-4a8d-9e1c-2b7a1e5d3c4f",
    title: "Cloud & Cybersecurity",
    subCategories: [
      {
        id: "b4f3c59e-d319-4edb-a062-5f8c4d37f6e0",
        category_id: "76bfc0a1-b62d-497a-b5a4-e6ea1c033ff0",
        title: "Cloud Computing",
        slug: "cloud-computing",
      },
      {
        id: "f4c03b78-54d4-4971-9dbb-42e7e58d70f1",
        category_id: "76bfc0a1-b62d-497a-b5a4-e6ea1c033ff0",
        title: "DevOps Engineering",
        slug: "devops-engineering",
      },
      {
        id: "a7596f43-c70c-4878-a48a-2a76e61cf97b",
        category_id: "76bfc0a1-b62d-497a-b5a4-e6ea1c033ff0",
        title: "Cybersecurity",
        slug: "cybersecurity",
      },
    ],
  },
  {
    id: "26b73c6d-6f68-4781-9c76-35d903c5b563",
    category_id: "3f1c9d2e-7b5a-4a8d-9e1c-2b7a1e5d3c4f",
    title: "Data Science & ML",
    subCategories: [
      {
        id: "f82ff9b7-56be-4e27-8f6f-053d66e3dff9",
        category_id: "26b73c6d-6f68-4781-9c76-35d903c5b563",
        title: "Machine Learning",
        slug: "machine-learning",
      },
      {
        id: "ce65cbe1-c3cc-47b4-8312-28259b8970fd",
        category_id: "26b73c6d-6f68-4781-9c76-35d903c5b563",
        title: "Computer Vision",
        slug: "computer-vision",
      },
      {
        id: "83a86a91-66a6-4b24-8a6c-303f36fe52b0",
        category_id: "26b73c6d-6f68-4781-9c76-35d903c5b563",
        title: "NLP (Natural Language Processing)",
        slug: "nlp-natural-language-processing",
      },
      {
        id: "ce3f3027-dcf1-408f-88d5-b706620f0be0",
        category_id: "26b73c6d-6f68-4781-9c76-35d903c5b563",
        title: "Deep Learning",
        slug: "deep-learning",
      },
    ],
  },
  {
    id: "8c2a6e1f-4d65-4d7d-9490-8d3fbe1e48fa",
    category_id: "3f1c9d2e-7b5a-4a8d-9e1c-2b7a1e5d3c4f",
    title: "Software Development",
    slug: "software-development",
    url: "/categories/programming-tech/software-development",
    subCategories: [
      {
        id: "70ed0547-7d79-460e-bb51-97c1b65e3df7",
        category_id: "8c2a6e1f-4d65-4d7d-9490-8d3fbe1e48fa",
        title: "Web Applications",
        slug: "web-applications",
        url: "/categories/programming-tech/software-development/web-applications",
      },
      {
        id: "76423207-3068-4cf1-8a60-4a8f2311a535",
        category_id: "8c2a6e1f-4d65-4d7d-9490-8d3fbe1e48fa",
        title: "Desktop Applications",
        slug: "desktop-applications",
        url: "/categories/programming-tech/software-development/desktop-applications",
      },
      {
        id: "85ab2385-b1d5-46d1-80b5-2ee25b35d1ed",
        category_id: "8c2a6e1f-4d65-4d7d-9490-8d3fbe1e48fa",
        title: "Automations & Workflows",
        slug: "automations-workflows",
        url: "/categories/programming-tech/software-development/automations-workflows",
      },
      {
        id: "bf0878bb-b56c-49ad-8366-6d7ca3d77b8d",
        category_id: "8c2a6e1f-4d65-4d7d-9490-8d3fbe1e48fa",
        title: "APIs & Integrations",
        slug: "apis-integrations",
        url: "/categories/programming-tech/software-development/apis-integrations",
      },
      {
        id: "9ccf2530-76f1-47d4-b3a9-4d1c8a85cc09",
        category_id: "8c2a6e1f-4d65-4d7d-9490-8d3fbe1e48fa",
        title: "Databases",
        slug: "databases",
        url: "/categories/programming-tech/software-development/databases",
      },
      {
        id: "380c02a5-cd72-44b3-b657-bb3c47724376",
        category_id: "8c2a6e1f-4d65-4d7d-9490-8d3fbe1e48fa",
        title: "Scripting",
        slug: "scripting",
        url: "/categories/programming-tech/software-development/scripting",
      },
      {
        id: "5ecfe1ff-bcd5-4638-b8d5-8b89f5b5f649",
        category_id: "8c2a6e1f-4d65-4d7d-9490-8d3fbe1e48fa",
        title: "QA & Review",
        slug: "qa-review",
        url: "/categories/programming-tech/software-development/qa-review",
      },
      {
        id: "3f927240-4426-4b98-a9c3-524fa2fffe64",
        category_id: "8c2a6e1f-4d65-4d7d-9490-8d3fbe1e48fa",
        title: "User Testing",
        slug: "user-testing",
        url: "/categories/programming-tech/software-development/user-testing",
      },
    ],
  },
];

export const subCategoriesByCategory = programmingTechSubCategories.flatMap(
  (category) => {
    const subCategories = category.subCategories.map((e) => {
      return { ...e, slug: `programming-tech/${e.slug}` };
    });

    return Object.values({
      ...subCategories,
    });
  },
);

export function findCategoryBySlug(slug: String) {
  return programmingTechSubCategories.reduce((result: any, category: any) => {
    if (result) return result; // If found, keep the result

    const found = category.slug === slug;
    if (found) return category;

    if (category.subCategories) {
      const found = category.subCategories.find(
        (sub: any) => sub.slug === slug,
      );
      if (found) return found;
    }
    return null;
  }, null);
}

export function findCategoriesBySlugs(slugs: string[]) {
  return programmingTechSubCategories.reduce(
    (foundSubcategories: any[], category) => {
      if (category.subCategories) {
        const matchingSubcategories = category.subCategories.filter(
          (subcategory) => slugs.includes(subcategory.slug),
        );
        foundSubcategories.push(...matchingSubcategories);
      }
      if (category.slug && slugs.includes(category.slug)) {
        foundSubcategories.push(category);
      }
      return foundSubcategories;
    },
    [],
  );
}

const slugsToFind = [
  "python",
  "html-css",
  "javascript",
  "wordpress",
  "shopify",
  "wix",
  "ios",
  "android",
  "unity",
];
export const foundMostPopulars = findCategoriesBySlugs(slugsToFind);

if (foundMostPopulars.length > 0) {
  console.log("Found subcategories:", foundMostPopulars);
} else {
  console.log("Subcategories not found.");
}

export const categories = [
  {
    id: "3f1c9d2e-7b5a-4a8d-9e1c-2b7a1e5d3c4f",
    category_id: null,
    slug: "programming-tech",
    title: "Programming & Tech",
    icon: "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/programming-tech-thin.56382a2.svg",
    icon2: "categories-section/programming-tech-thin.56382a2.svg",
    description:
      "Web development, mobile app development, eCommerce development, WordPress, AI & machine learning, and cybersecurity.",
    slogen: "You think it. A programmer <br /> <span>develops it.</span>",
    url: "/categories/programming-tech",
    subCategories: programmingTechSubCategories,
    mostPopulars: foundMostPopulars,
  },

  {
    id: "f3a5d8a2-7b1f-4c90-9c1c-9e1b3b1f2a33",
    category_id: null,
    slug: "graphics-design",
    title: "Graphics & Design",
    icon: "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/graphics-design-thin.ff38893.svg",
    icon2: "categories-section/graphics-design-thin.ff38893.svg",
    description:
      "Logo design, website design, game design, illustration, packaging design, architecture & interior design, fashion & jewelry design, and more.",
  },
  {
    id: "1c9a3b6e-6d41-4d82-9423-58b8e3b0df29",
    category_id: null,
    slug: "digital-marketing",
    title: "Digital Marketing",
    icon: "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/digital-marketing-thin.68edb44.svg",
    icon2: "categories-section/digital-marketing-thin.68edb44.svg",
    description:
      "SEO, social media marketing, paid advertising, content management, and marketing campaigns.",
  },
  {
    id: "a7d28bfa-2b87-4e4a-8f4e-1d1b2d4e1a7c",
    category_id: null,
    slug: "writing-translation",
    title: "Writing & Translation",
    icon: "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/writing-translation-thin.fd3699b.svg",
    icon2: "categories-section/writing-translation-thin.fd3699b.svg",
    description:
      "Blog writing, copywriting, book writing, translation services, proofreading, and editing.",
  },
  {
    id: "5fbc3d2e-1d5a-4f07-b6d1-8e1c9a5f2d7e",
    category_id: null,
    slug: "video-animation",
    title: "Video & Animation",
    icon: "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/video-animation-thin.9d3f24d.svg",
    icon2: "categories-section/video-animation-thin.9d3f24d.svg",
    description:
      "Video editing, animation, 3D modeling, explainer videos, intros & outros, and more.",
  },
  {
    id: "9e4d2a1b-3f8c-4b71-81d5-2b7a1e9c3d5f",
    category_id: null,
    slug: "music-audio",
    title: "Music & Audio",
    icon: "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/music-audio-thin.43a9801.svg",
    icon2: "categories-section/music-audio-thin.43a9801.svg",
    description:
      "Voice-over, music production, sound effects, mixing & mastering, podcast editing, and jingles.",
  },
  {
    id: "2b1d4e7a-5c3f-4a9d-8e1c-7b2f1d5a9e3c",
    category_id: null,
    slug: "business",
    title: "Business",
    icon: "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/business-thin.885e68e.svg",
    icon2: "categories-section/business-thin.885e68e.svg",
    description:
      "Business consulting, virtual assistants, financial consulting, market research, presentations, and business plans.",
  },

  {
    id: "7b2f1d5a-9e3c-4a8d-2b1d4e1c5f7a",
    category_id: null,
    slug: "data",
    title: "Data",
    icon: "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/ai-services-thin.104f389.svg",
    icon2: "categories-section/ai-services-thin.104f389.svg",
    description:
      "Data entry, data analysis, data visualization, data science, and databases.",
  },
  {
    id: "3d5a9e1c-7b2f-4a8d-2b1d4e1c5f7a",
    category_id: null,
    slug: "lifestyle",
    title: "Lifestyle",
    icon: "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/consulting-thin.d5547ff.svg",
    icon2: "categories-section/consulting-thin.d5547ff.svg",
    description: "Consulting",
  },
];

export const categoriesMenuData = [
  {
    title: "Programming & Tech",
    href: "/categories/programming-tech?source=category_tree",
  },
  {
    title: "Graphics & Design",
    href: "/categories/graphics-design?source=category_tree",
  },
  {
    title: "Digital Marketing",
    href: "/categories/online-marketing?source=category_tree",
  },
  {
    title: "Video & Animation",
    href: "/categories/video-animation?source=category_tree",
  },
  {
    title: "Writing & Translation",
    href: "/categories/writing-translation?source=category_tree",
  },
  {
    title: "Music & Audio",
    href: "/categories/music-audio?source=category_tree",
  },
  {
    title: "Business",
    href: "/categories/business?source=category_tree",
  },
  {
    title: "Finance",
    href: "/categories/finance?source=category_tree",
  },
  {
    title: "AI Services",
    href: "/categories/ai-services",
  },
  {
    title: "Personal Growth",
    href: "/categories/lifestyle?source=category_tree",
  },
  {
    title: "Consulting",
    href: "/categories/consulting-services",
  },
  {
    title: "Data",
    href: "/categories/data?source=category_tree",
  },
  {
    title: "Photography",
    href: "/categories/photography?source=category_tree",
  },
];
