interface Category {
  id: string;

  slug: string;

  url: string;

  title: string;

  parentId?: string | null;

  icon?: string;

  description?: string;

  slogan?: string;
}

export const generateUrl = (parentUrl: string | undefined, slug: string) =>
  `${parentUrl}/${slug}`;

export const root_categories: Category[] = [
  {
    id: '3f1c9d2e-7b5a-4a8d-9e1c-2b7a1e5d3c4f',
    parentId: undefined,
    title: 'Programming & Tech',
    slug: 'programming-tech',
    url: '/categories/programming-tech',
    icon: 'https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/programming-tech-thin.56382a2.svg',
    description:
      'Web development, mobile app development, eCommerce development, WordPress, AI & machine learning, and cybersecurity.',
    slogan: 'You think it. A programmer <br /> <span>develops it.</span>',
  },
  {
    id: '1c9a3b6e-6d41-4d82-9423-58b8e3b0df29',
    parentId: undefined,
    title: 'Digital Marketing',
    slug: 'digital-marketing',
    url: '/categories/digital-marketing',
    icon: 'https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/digital-marketing-thin.68edb44.svg',
    description:
      'SEO, social media marketing, paid advertising, content management, and marketing campaigns.',
    slogan: 'Boost your brand. <br /> <span>Reach more customers.</span>',
  },
  {
    id: 'a7d28bfa-2b87-4e4a-8f4e-1d1b2d4e1a7c',
    parentId: undefined,
    title: 'Writing & Translation',
    slug: 'writing-translation',
    url: '/categories/writing-translation',
    icon: 'https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/writing-translation-thin.fd3699b.svg',
    description:
      'Blog writing, copywriting, book writing, translation services, proofreading, and editing.',
    slogan: 'Words matter. <br /> <span>Craft your message.</span>',
  },
  {
    id: '5fbc3d2e-1d5a-4f07-b6d1-8e1c9a5f2d7e',
    parentId: undefined,
    title: 'Video & Animation',
    slug: 'video-animation',
    url: '/categories/video-animation',
    icon: 'https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/video-animation-thin.9d3f24d.svg',
    description:
      'Video editing, animation, 3D modeling, explainer videos, intros & outros, and more.',
    slogan: 'Bring ideas to life. <br /> <span>Engage your audience.</span>',
  },
  {
    id: '9e4d2a1b-3f8c-4b71-81d5-2b7a1e9c3d5f',
    parentId: undefined,
    title: 'Music & Audio',
    slug: 'music-audio',
    url: '/categories/music-audio',
    icon: 'https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/music-audio-thin.43a9801.svg',
    description:
      'Voice-over, music production, sound effects, mixing & mastering, podcast editing, and jingles.',
    slogan: 'Let the world hear you. <br /> <span>Create your sound.</span>',
  },
  {
    id: '2b1d4e7a-5c3f-4a9d-8e1c-7b2f1d5a9e3c',
    parentId: undefined,
    title: 'Business',
    slug: 'business',
    url: '/categories/business',
    icon: 'https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/business-thin.885e68e.svg',
    description:
      'Business consulting, virtual assistants, financial consulting, market research, presentations, and business plans.',
    slogan: 'Success starts here. <br /> <span>Grow your business.</span>',
  },
  {
    id: '7b2f1d5a-9e3c-4a8d-2b1d4e1c5f7a',
    parentId: undefined,
    title: 'Data',
    slug: 'data',
    url: '/categories/data',
    icon: 'https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/ai-services-thin.104f389.svg',
    description:
      'Data entry, data analysis, data visualization, data science, and databases.',
    slogan:
      'Turn data into insights. <br /> <span>Make informed decisions.</span>',
  },
  {
    id: '3d5a9e1c-7b2f-4a8d-2b1d4e1c5f7a',
    parentId: undefined,
    title: 'Lifestyle',
    slug: 'lifestyle',
    url: '/categories/lifestyle',
    icon: 'https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/consulting-thin.d5547ff.svg',
    description: 'Consulting',
    slogan: 'Enhance your life. <br /> <span>Find your balance.</span>',
  },
];

export const [programmingTech_category, ...others] = root_categories;

export const programmingTech_subCategories = [
  {
    id: '8e2d1a7b-3c9f-4d5a-6b1e-2f7a4c8d3e9f',
    title: 'Website Development',
    slug: 'website-development',
    description:
      'Create, build, and develop your website with skilled website developers',
  },
  {
    id: 'd0739b2a-df3b-4cb2-8f80-7416a3e13c4a',
    title: 'Website Platform',
    slug: 'website-platform',
    description: '',
  },
  {
    id: '8c2d3f5f-907d-4f98-b5b5-bc5a1c8b8d13',
    title: 'Website Maintenance',
    slug: 'website-maintenance',
    description: '',
  },
  {
    id: 'b8e4d703-9e6b-4f2f-a9a0-94d4f2643c6f',
    title: 'AI Development',
    slug: 'ai-development',
    description: '',
  },
  {
    id: 'a2d98fc3-cb99-4655-9eaf-92cfb2134d84',
    title: 'Chatbot Development',
    slug: 'chatbot-development',
    description: '',
  },
  {
    id: '8fefea57-cff4-4690-bba9-febcb87283b3',
    title: 'Game Development',
    slug: 'game-development',
    description: '',
  },
  {
    id: 'ded4b34f-29a3-48f2-bbd5-101d42a6ecde',
    title: 'Mobile App Development',
    slug: 'mobile-app-development',
    description: '',
  },
  {
    id: '76bfc0a1-b62d-497a-b5a4-e6ea1c033ff0',
    title: 'Cloud & Cybersecurity',
    slug: 'cloud-cybersecurity',
    description: '',
  },
  {
    id: '26b73c6d-6f68-4781-9c76-35d903c5b563',
    title: 'Data Science & ML',
    slug: 'datascience-machinelearning',
    description: '',
  },
  {
    id: '8c2a6e1f-4d65-4d7d-9490-8d3fbe1e48fa',
    title: 'Software Development',
    slug: 'software-development',
    description: '',
  },
].map((sub) => ({
  ...sub,
  parentId: programmingTech_category.id,
  url: generateUrl(programmingTech_category.url, sub.slug),
}));

export const [
  programmingTech_websiteDevelopment_category,
  programmingTech_websitePlatform_category,
  programmingTech_websiteMaintenance_category,
  programmingTech_aiDevelopment_category,
  programmingTech_chatbotDevelopment_category,
  programmingTech_gameDevelopment_category,
  programmingTech_mobileAppDevelopment_category,
  programmingTech_cloudCybersecurity_category,
  programmingTech_datascienceMachineLearning_category,
  programmingTech_softwareDevelopment_category,
] = programmingTech_subCategories;

export const programmingTech_websiteDevelopment_subCategory = [
  {
    id: 'af0722a4-00c2-484e-b205-4d8527a78228',
    title: 'Python Developers',
    slug: 'python',
    icon: 'https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/cb63c6dd487dc1630100243adea2913e-1727009044233/Python%20Developers.png',
    description:
      'Create professional Python based web applications with the help of freelance Python experts',
  },
  {
    id: '3cc198c5-7192-4d6c-b4d8-b062ee1c7b4d',
    title: 'HTML & CSS Developers',
    slug: 'html-css',
    icon: 'https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/8ab683c462bb7021359f813a67f0a210-1727008217020/HTML%20_%20CSS%20Developers.png',
    description:
      'Find the best HTML & CSS developers services you need to help you successfully meet your project planning goals and deadline',
  },
  {
    id: '9656aec9-8c36-4c07-98a2-bc37fdd5ff63',
    title: 'JavaScript Developers',
    slug: 'javascript',
    icon: 'https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/cb63c6dd487dc1630100243adea2913e-1727009044218/JavaScript%20Developers.png',
    description:
      'Find the best JavaScript developers services you need to help you successfully meet your project planning goals and deadline',
  },
  {
    id: 'b9f7c618-cc7a-4a63-a927-fd15e1a569ed',
    title: 'Business Websites',
    slug: 'business-websites',
    description: '',
  },
  {
    id: '7620a97b-8f5f-4d45-9a29-345b8e2c5752',
    title: 'E-Commerce Development',
    slug: 'e-commerce-development',
    description: '',
  },
  {
    id: '5bda5b78-c8c0-4de1-95c1-e1a9b61c29ea',
    title: 'Landing Pages',
    slug: 'landing-pages',
    description: '',
  },
  {
    id: '14f1b758-2a2b-4414-80d7-f76f4b1695a7',
    title: 'Dropshipping Websites',
    slug: 'dropshipping-websites',
    description: '',
  },
  {
    id: 'acbe1f82-cfd8-4c1a-82fe-befde076ab0e',
    title: 'Build a Complete Website',
    slug: 'build-a-complete-website',
    description: '',
  },
].map((sub) => ({
  ...sub,
  parentId: programmingTech_websiteDevelopment_category.id,
  url: generateUrl(programmingTech_websiteDevelopment_category.url, sub.slug),
}));

export const programmingTech_websitePlatform_subCategory = [
  {
    id: 'afb9e093-b692-45a5-8d18-a25299e7e8f9',
    title: 'WordPress Developers',
    slug: 'wordpress',
    icon: 'https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/a4f23e7ad88e3c639e545e7f1ef6c24c-1727084447004/WordPress%20Developers.png',
    description:
      'Find a freelance WordPress development expert to build your WordPress website',
  },
  {
    id: '33594b0e-f360-46ea-9a00-94b417c819b2',
    title: 'Shopify Developers',
    slug: 'shopify',
    icon: 'https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/148a459235c2efcccf74882dd6790246-1727083583518/Shopify%20Developers.png',
    description: 'Find a developer to build your Shopify site',
  },
  {
    id: 'dede312d-6e9c-474d-92b9-85aa50650aa2',
    title: 'Wix Developers',
    slug: 'wix',
    icon: 'https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/a4f23e7ad88e3c639e545e7f1ef6c24c-1727084447000/Wix%20Developers.png',
    description: 'Find a developer to build your Wix site',
  },
  {
    id: '3f1d45e8-2d53-4c8e-9e9d-897d3c8f1b57',
    title: 'GoDaddy',
    slug: 'go-daddy',
    parent_category_id: 'd0739b2a-df3b-4cb2-8f80-7416a3e13c4a',
  },
].map((sub) => ({
  ...sub,
  parentId: programmingTech_websitePlatform_category.id,
  url: generateUrl(programmingTech_websitePlatform_category.url, sub.slug),
}));

export const programmingTech_websiteMaintenance_subCategory = [
  {
    id: '33a74bc2-78b4-45e9-a8a9-5197d462abf5',
    title: 'Website Customization',
    slug: 'website-customization',
  },
  {
    id: '27db6e5f-93f9-4b26-82b9-13978b397a5e',
    title: 'Bug Fixes',
    slug: 'bug-fixes',
  },
  {
    id: '0f9b7d7d-e78e-4f63-a209-30368fbb0b83',
    title: 'Backup & Migration',
    slug: 'backup-migration',
  },
  {
    id: 'c9d75a1e-2b49-49c9-b9b3-4bb2b2087b35',
    title: 'Speed Optimization',
    slug: 'speed-optimization',
  },
].map((sub) => ({
  ...sub,
  parentId: programmingTech_websiteMaintenance_category.id,
  url: generateUrl(programmingTech_websiteMaintenance_category.url, sub.slug),
}));

export const programmingTech_aiDevelopment_subCategory = [
  {
    id: 'cdd32bfa-dcf7-4699-bc77-bf467c6ed7a4',
    title: 'AI Websites & Software',
    slug: 'ai-websites-software',
  },
  {
    id: '5b4b7a34-9b8f-4b1b-b3e6-30f99eb10061',
    title: 'AI Mobile Apps',
    slug: 'ai-mobile-apps',
  },
  {
    id: 'b0a634f9-cd88-4198-a4bc-c65ad9f1e27e',
    title: 'AI Integrations',
    slug: 'ai-integrations',
  },
  {
    id: '71c87f2e-9a31-4b55-b43e-c29b2b8762fc',
    title: 'AI Agents',
    slug: 'ai-agents',
  },
  {
    id: '7fe47cd4-c76d-4f27-90c3-c1d8a93bba32',
    title: 'AI Fine-Tuning',
    slug: 'ai-fine-tuning',
  },
  {
    id: '1119f032-c299-4403-9d1f-e63a06433b35',
    title: 'AI Technology Consulting',
    slug: 'ai-technology-consulting',
  },
].map((sub) => ({
  ...sub,
  parentId: programmingTech_aiDevelopment_category.id,
  url: generateUrl(programmingTech_aiDevelopment_category.url, sub.slug),
}));

export const programmingTech_chatbotDevelopment_subCategory = [
  {
    id: 'f97d0a92-30c1-4e7f-83c4-276acbce098e',
    title: 'AI Chatbot',
    slug: 'ai-chatbot',
  },
  {
    id: 'd7b799b6-975f-49d3-a33d-5b462a7a9b87',
    title: 'Rules Based Chatbot',
    slug: 'rules-based-chatbot',
  },
  {
    id: 'e68555d7-b48c-4007-8830-b57fe9f88ff0',
    title: 'Discord',
    slug: 'discord',
  },
  {
    id: '07dce4e0-12f7-497d-bb44-b7d4979efed0',
    title: 'Telegram',
    slug: 'telegram',
  },
].map((sub) => ({
  ...sub,
  parentId: programmingTech_chatbotDevelopment_category.id,
  url: generateUrl(programmingTech_chatbotDevelopment_category.url, sub.slug),
}));

export const programmingTech_gameDevelopment_subCategory = [
  {
    id: '3ed72dfd-89ed-4685-a91c-cb47820c1578',
    title: 'Gameplay Experience & Feedback',
    slug: 'gameplay-experience-feedback',
  },
  {
    id: '54238f60-bc1b-4b59-a028-cd0977087cb9',
    title: 'PC Games',
    slug: 'pc-games',
  },
  {
    id: 'c7f79b9d-b40b-4ac1-a9bb-d98adfc727ea',
    title: 'Mobile Games',
    slug: 'mobile-games',
  },
  {
    id: 'bf90a7bf-ca86-42b6-bb33-9869ecc79182',
    title: 'Unity Developers',
    slug: 'unity',
    icon: 'https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/148a459235c2efcccf74882dd6790246-1727083583542/Unity%20Developers.png',
  },
].map((sub) => ({
  ...sub,
  parentId: programmingTech_gameDevelopment_category.id,
  url: generateUrl(programmingTech_gameDevelopment_category.url, sub.slug),
}));

export const programmingTech_mobileAppDevelopment_subCategory = [
  {
    id: '1a57b82b-019b-44e6-9e8b-89d5b703e4ea',
    title: 'Cross-platform Development',
    slug: 'cross-platform-development',
  },
  {
    id: '2d3a0e3d-157a-43bb-bbe6-5f06b4bb75b1',
    title: 'Android App Developers',
    slug: 'android',
    icon: 'https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/1857ea6cdffed9de2c5739f010338061-1727172011179/Android%20App%20Development.png',
    description: 'Go mobile with custom Android apps.',
  },
  {
    id: 'ad63965a-5cc2-4520-8c5a-b5d08bc30f5f',
    title: 'iOS App Developers',
    slug: 'ios',
    icon: 'https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/1857ea6cdffed9de2c5739f010338061-1727172011194/iOS%20App%20Development.png',
    description: 'Go mobile with custom iOS apps.',
  },
  {
    id: 'd5c7db1f-f6d7-4b3b-a2c7-b8c5c25ec599',
    title: 'Website to App',
    slug: 'website-to-app',
  },
  {
    id: '50ae8b27-b064-4c1f-a7e7-d0ebd30a2db6',
    title: 'Mobile App Maintenance',
    slug: 'mobile-app-maintenance',
  },
  {
    id: '1897200f-88b5-4c7c-b9e9-e3f0f83ed2d0',
    title: 'VR & AR Development',
    slug: 'vr-ar-development',
  },
].map((sub) => ({
  ...sub,
  parentId: programmingTech_mobileAppDevelopment_category.id,
  url: generateUrl(programmingTech_mobileAppDevelopment_category.url, sub.slug),
}));

export const programmingTech_cloudCybersecurity_subCategory = [
  {
    id: 'b4f3c59e-d319-4edb-a062-5f8c4d37f6e0',
    title: 'Cloud Computing',
    slug: 'cloud-computing',
  },
  {
    id: 'f4c03b78-54d4-4971-9dbb-42e7e58d70f1',
    title: 'DevOps Engineering',
    slug: 'devops-engineering',
  },
  {
    id: 'a7596f43-c70c-4878-a48a-2a76e61cf97b',
    title: 'Cybersecurity',
    slug: 'cybersecurity',
  },
].map((sub) => ({
  ...sub,
  parentId: programmingTech_cloudCybersecurity_category.id,
  url: generateUrl(programmingTech_cloudCybersecurity_category.url, sub.slug),
}));

export const programmingTech_datascienceMachineLearning_subCategory = [
  {
    id: 'f82ff9b7-56be-4e27-8f6f-053d66e3dff9',
    title: 'Machine Learning',
    slug: 'machine-learning',
  },
  {
    id: 'ce65cbe1-c3cc-47b4-8312-28259b8970fd',
    title: 'Computer Vision',
    slug: 'computer-vision',
  },
  {
    id: '83a86a91-66a6-4b24-8a6c-303f36fe52b0',
    title: 'NLP (Natural Language Processing)',
    slug: 'nlp-natural-language-processing',
  },
  {
    id: 'ce3f3027-dcf1-408f-88d5-b706620f0be0',
    title: 'Deep Learning',
    slug: 'deep-learning',
  },
].map((sub) => ({
  ...sub,
  parentId: programmingTech_datascienceMachineLearning_category.id,
  url: generateUrl(
    programmingTech_datascienceMachineLearning_category.url,
    sub.slug,
  ),
}));

export const programmingTech_softwareDevelopment_subCategory = [
  {
    id: '70ed0547-7d79-460e-bb51-97c1b65e3df7',
    title: 'Web Applications',
    slug: 'web-applications',
  },
  {
    id: '76423207-3068-4cf1-8a60-4a8f2311a535',
    title: 'Desktop Applications',
    slug: 'desktop-applications',
  },
  {
    id: '85ab2385-b1d5-46d1-80b5-2ee25b35d1ed',
    title: 'Automations & Workflows',
    slug: 'automations-workflows',
  },
  {
    id: 'bf0878bb-b56c-49ad-8366-6d7ca3d77b8d',
    title: 'APIs & Integrations',
    slug: 'apis-integrations',
  },
  {
    id: '9ccf2530-76f1-47d4-b3a9-4d1c8a85cc09',
    title: 'Databases',
    slug: 'databases',
  },
  {
    id: '380c02a5-cd72-44b3-b657-bb3c47724376',
    title: 'Scripting',
    slug: 'scripting',
  },
  {
    id: '5ecfe1ff-bcd5-4638-b8d5-8b89f5b5f649',
    title: 'QA & Review',
    slug: 'qa-review',
  },
  {
    id: '3f927240-4426-4b98-a9c3-524fa2fffe64',
    title: 'User Testing',
    slug: 'user-testing',
  },
].map((sub) => ({
  ...sub,
  parentId: programmingTech_softwareDevelopment_category.id,
  url: generateUrl(programmingTech_softwareDevelopment_category.url, sub.slug),
}));

export const categories: Category[] = [
  ...root_categories,
  ...programmingTech_subCategories,
  ...programmingTech_websiteDevelopment_subCategory,
  ...programmingTech_websitePlatform_subCategory,
  ...programmingTech_websiteMaintenance_subCategory,
  ...programmingTech_aiDevelopment_subCategory,
  ...programmingTech_chatbotDevelopment_subCategory,
  ...programmingTech_gameDevelopment_subCategory,
  ...programmingTech_mobileAppDevelopment_subCategory,
  ...programmingTech_cloudCybersecurity_subCategory,
  ...programmingTech_datascienceMachineLearning_subCategory,
  ...programmingTech_softwareDevelopment_subCategory,
];
