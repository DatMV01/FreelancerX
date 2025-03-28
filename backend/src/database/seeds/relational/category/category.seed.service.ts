import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class CategorySeedService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repository: Repository<CategoryEntity>,
  ) {}

  async run() {
    await this.repository.query('SET FOREIGN_KEY_CHECKS=0;');
    await this.repository.clear();
    await this.repository.query('SET FOREIGN_KEY_CHECKS=1;');

    const root_categories: DeepPartial<CategoryEntity[]> = [
      {
        id: '3f1c9d2e-7b5a-4a8d-9e1c-2b7a1e5d3c4f',
        parentCategoryId: undefined,
        parentCategorySlug: undefined,
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
        parentCategoryId: undefined,
        parentCategorySlug: undefined,
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
        parentCategoryId: undefined,
        parentCategorySlug: undefined,
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
        parentCategoryId: undefined,
        parentCategorySlug: undefined,
        title: 'Video & Animation',
        slug: 'video-animation',
        url: '/categories/video-animation',
        icon: 'https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/video-animation-thin.9d3f24d.svg',
        description:
          'Video editing, animation, 3D modeling, explainer videos, intros & outros, and more.',
        slogan:
          'Bring ideas to life. <br /> <span>Engage your audience.</span>',
      },
      {
        id: '9e4d2a1b-3f8c-4b71-81d5-2b7a1e9c3d5f',
        parentCategoryId: undefined,
        parentCategorySlug: undefined,
        title: 'Music & Audio',
        slug: 'music-audio',
        url: '/categories/music-audio',
        icon: 'https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/music-audio-thin.43a9801.svg',
        description:
          'Voice-over, music production, sound effects, mixing & mastering, podcast editing, and jingles.',
        slogan:
          'Let the world hear you. <br /> <span>Create your sound.</span>',
      },
      {
        id: '2b1d4e7a-5c3f-4a9d-8e1c-7b2f1d5a9e3c',
        parentCategoryId: undefined,
        parentCategorySlug: undefined,
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
        parentCategoryId: undefined,
        parentCategorySlug: undefined,
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
        parentCategoryId: undefined,
        parentCategorySlug: undefined,
        title: 'Lifestyle',
        slug: 'lifestyle',
        url: '/categories/lifestyle',
        icon: 'https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/consulting-thin.d5547ff.svg',
        description: 'Consulting',
        slogan: 'Enhance your life. <br /> <span>Find your balance.</span>',
      },
    ] as any;

    const [programmingTech_category, ...others] = root_categories as any;

    const programmingTech_subCategories = [
      {
        id: '8e2d1a7b-3c9f-4d5a-6b1e-2f7a4c8d3e9f',
        parentCategoryId: programmingTech_category.id,
        parentCategorySlug: programmingTech_category.slug,
        title: 'Website Development',
        slug: 'website-development',
        url: `${programmingTech_category.url}/website-development`,
        description:
          'Create, build, and develop your website with skilled website developers',
      },

      {
        id: 'd0739b2a-df3b-4cb2-8f80-7416a3e13c4a',
        parentCategoryId: programmingTech_category.id,
        parentCategorySlug: programmingTech_category.slug,
        title: 'Website Platform',
        slug: 'website-platform',
        url: `${programmingTech_category.url}/website-platform`,
        description: '',
      },

      {
        id: '8c2d3f5f-907d-4f98-b5b5-bc5a1c8b8d13',
        parentCategoryId: programmingTech_category.id,
        parentCategorySlug: programmingTech_category.slug,
        title: 'Website Maintenance',
        slug: 'website-maintenance',
        url: `${programmingTech_category.url}/website-maintenance`,
        description: '',
      },

      {
        id: 'b8e4d703-9e6b-4f2f-a9a0-94d4f2643c6f',
        parentCategoryId: programmingTech_category.id,
        parentCategorySlug: programmingTech_category.slug,
        slug: 'ai-development',
        title: 'AI Development',
        url: `${programmingTech_category.url}/ai-development`,
        description: '',
      },

      {
        id: 'a2d98fc3-cb99-4655-9eaf-92cfb2134d84',
        parentCategoryId: programmingTech_category.id,
        parentCategorySlug: programmingTech_category.slug,
        title: 'Chatbot Development',
        slug: 'chatbot-development',
        url: `${programmingTech_category.url}/chatbot-development`,
        description: '',
      },

      {
        id: '8fefea57-cff4-4690-bba9-febcb87283b3',
        parentCategoryId: programmingTech_category.id,
        parentCategorySlug: programmingTech_category.slug,
        title: 'Game Development',
        slug: 'game-development',
        url: `${programmingTech_category.url}/game-development`,
        description: '',
      },

      {
        id: 'ded4b34f-29a3-48f2-bbd5-101d42a6ecde',
        parentCategoryId: programmingTech_category.id,
        parentCategorySlug: programmingTech_category.slug,
        title: 'Mobile App Development',
        slug: 'mobile-app-development',
        url: `${programmingTech_category.url}/mobile-app-development`,
        description: '',
      },

      {
        id: '76bfc0a1-b62d-497a-b5a4-e6ea1c033ff0',
        parentCategoryId: programmingTech_category.id,
        parentCategorySlug: programmingTech_category.slug,
        title: 'Cloud & Cybersecurity',
        slug: 'cloud-cybersecurity',
        url: `${programmingTech_category.url}/cloud-cybersecurity`,
        description: '',
      },

      {
        id: '26b73c6d-6f68-4781-9c76-35d903c5b563',
        parentCategoryId: programmingTech_category.id,
        parentCategorySlug: programmingTech_category.slug,
        title: 'Data Science & ML',
        slug: 'datascience-machinelearning',
        url: `${programmingTech_category.url}/datascience-machinelearning`,
        description: '',
      },

      {
        id: '8c2a6e1f-4d65-4d7d-9490-8d3fbe1e48fa',
        parentCategoryId: programmingTech_category.id,
        parentCategorySlug: programmingTech_category.slug,
        title: 'Software Development',
        slug: 'software-development',
        url: `${programmingTech_category.url}/software-development`,
        description: '',
      },
    ];

    const [
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

    const programmingTech_websiteDevelopment_subCategory = [
      {
        id: 'af0722a4-00c2-484e-b205-4d8527a78228',
        parentCategoryId: programmingTech_websiteDevelopment_category.id,
        parentCategorySlug: programmingTech_websiteDevelopment_category.slug,
        icon: 'https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/cb63c6dd487dc1630100243adea2913e-1727009044233/Python%20Developers.png',
        title: 'Python Developers',
        slug: 'python',
        url: `${programmingTech_websiteDevelopment_category.url}/python`,
        description:
          'Create professional Python based web applications with the help of freelance Python experts',
      },

      {
        id: '3cc198c5-7192-4d6c-b4d8-b062ee1c7b4d',
        parentCategoryId: programmingTech_websiteDevelopment_category.id,
        parentCategorySlug: programmingTech_websiteDevelopment_category.slug,
        icon: 'https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/8ab683c462bb7021359f813a67f0a210-1727008217020/HTML%20_%20CSS%20Developers.png',
        title: 'HTML & CSS Developers',
        slug: 'html-css',
        url: `${programmingTech_websiteDevelopment_category.url}/html-css`,
        description:
          'Find the best HTML & CSS developers services you need to help you successfully meet your project planning goals and deadline',
      },

      {
        id: '9656aec9-8c36-4c07-98a2-bc37fdd5ff63',
        parentCategoryId: programmingTech_websiteDevelopment_category.id,
        parentCategorySlug: programmingTech_websiteDevelopment_category.slug,
        icon: 'https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/cb63c6dd487dc1630100243adea2913e-1727009044218/JavaScript%20Developers.png',
        title: 'JavaScript Developers',
        slug: 'javascript',

        url: `${programmingTech_websiteDevelopment_category.url}/javascript`,
        description:
          'Find the best JavaScript developers services you need to help you successfully meet your project planning goals and deadline',
      },

      {
        id: 'b9f7c618-cc7a-4a63-a927-fd15e1a569ed',
        parentCategoryId: programmingTech_websiteDevelopment_category.id,
        parentCategorySlug: programmingTech_websiteDevelopment_category.slug,
        title: 'Business Websites',
        slug: 'business-websites',
        url: `${programmingTech_websiteDevelopment_category.url}/business-websites`,
        description: '',
      },

      {
        id: '7620a97b-8f5f-4d45-9a29-345b8e2c5752',
        parentCategoryId: programmingTech_websiteDevelopment_category.id,
        parentCategorySlug: programmingTech_websiteDevelopment_category.slug,
        title: 'E-Commerce Development',
        slug: 'e-commerce-development',
        url: `${programmingTech_websiteDevelopment_category.url}/e-commerce-development`,
        description: '',
      },

      {
        id: '5bda5b78-c8c0-4de1-95c1-e1a9b61c29ea',
        parentCategoryId: programmingTech_websiteDevelopment_category.id,
        parentCategorySlug: programmingTech_websiteDevelopment_category.slug,
        title: 'Landing Pages',
        slug: 'landing-pages',
        url: `${programmingTech_websiteDevelopment_category.url}/landing-pages`,
        description: '',
      },

      {
        id: '14f1b758-2a2b-4414-80d7-f76f4b1695a7',
        parentCategoryId: programmingTech_websiteDevelopment_category.id,
        parentCategorySlug: programmingTech_websiteDevelopment_category.slug,
        title: 'Dropshipping Websites',
        slug: 'dropshipping-websites',
        url: `${programmingTech_websiteDevelopment_category.url}/dropshipping-websites`,
        description: '',
      },

      {
        id: 'acbe1f82-cfd8-4c1a-82fe-befde076ab0e',
        parentCategoryId: programmingTech_websiteDevelopment_category.id,
        parentCategorySlug: programmingTech_websiteDevelopment_category.slug,
        title: 'Build a Complete Website',
        slug: 'build-a-complete-website',
        url: `${programmingTech_websiteDevelopment_category.url}/build-a-complete-website`,
        description: '',
      },
    ];

    const programmingTech_websitePlatform_subCategory = [
      {
        id: 'afb9e093-b692-45a5-8d18-a25299e7e8f9',
        parentCategoryId: programmingTech_websitePlatform_category.id,
        parentCategorySlug: programmingTech_websitePlatform_category.slug,
        icon: 'https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/a4f23e7ad88e3c639e545e7f1ef6c24c-1727084447004/WordPress%20Developers.png',
        title: 'WordPress Developers',
        slug: 'wordpress',
        url: `${programmingTech_websitePlatform_category.url}/wordpress`,
        description:
          'Find a freelance WordPress development expert to build your WordPress website',
      },

      {
        id: '33594b0e-f360-46ea-9a00-94b417c819b2',
        parentCategoryId: programmingTech_websitePlatform_category.id,
        parentCategorySlug: programmingTech_websitePlatform_category.slug,
        icon: 'https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/148a459235c2efcccf74882dd6790246-1727083583518/Shopify%20Developers.png',
        title: 'Shopify Developers',
        slug: 'shopify',
        url: `${programmingTech_websitePlatform_category.url}/shopify`,
        description: 'Find a developer to build your Shopify site',
      },

      {
        id: 'dede312d-6e9c-474d-92b9-85aa50650aa2',
        parentCategoryId: programmingTech_websitePlatform_category.id,
        parentCategorySlug: programmingTech_websitePlatform_category.slug,
        icon: 'https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/a4f23e7ad88e3c639e545e7f1ef6c24c-1727084447000/Wix%20Developers.png',
        title: 'Wix Developers',
        slug: 'wix',
        url: `${programmingTech_websitePlatform_category.url}/wix`,
        description: 'Find a developer to build your Wix site',
      },
      {
        id: '3f1d45e8-2d53-4c8e-9e9d-897d3c8f1b57',
        parentCategoryId: programmingTech_websitePlatform_category.id,
        parentCategorySlug: programmingTech_websitePlatform_category.slug,
        parent_category_id: 'd0739b2a-df3b-4cb2-8f80-7416a3e13c4a',
        title: 'GoDaddy',
        slug: 'go-daddy',
        url: `${programmingTech_websitePlatform_category.url}/go-daddy`,
      },
    ];

    const programmingTech_websiteMaintenance_subCategory = [
      {
        id: '33a74bc2-78b4-45e9-a8a9-5197d462abf5',
        parentCategoryId: programmingTech_websiteMaintenance_category.id,
        parentCategorySlug: programmingTech_websiteMaintenance_category.slug,
        icon: '',
        title: 'Website Customization',
        slug: 'website-customization',
        url: `${programmingTech_websiteMaintenance_category.url}/website-customization`,
        description: '',
      },

      {
        id: '27db6e5f-93f9-4b26-82b9-13978b397a5e',
        parentCategoryId: programmingTech_websiteMaintenance_category.id,
        parentCategorySlug: programmingTech_websiteMaintenance_category.slug,
        icon: '',
        title: 'Bug Fixes',
        slug: 'bug-fixes',
        url: `${programmingTech_websiteMaintenance_category.url}/bug-fixes`,
        description: '',
      },

      {
        id: '0f9b7d7d-e78e-4f63-a209-30368fbb0b83',
        parentCategoryId: programmingTech_websiteMaintenance_category.id,
        parentCategorySlug: programmingTech_websiteMaintenance_category.slug,
        icon: '',
        title: 'Backup & Migration',
        slug: 'backup-migration',
        url: `${programmingTech_websiteMaintenance_category.url}/backup-migration`,
        description: '',
      },

      {
        id: 'c9d75a1e-2b49-49c9-b9b3-4bb2b2087b35',
        parentCategoryId: programmingTech_websiteMaintenance_category.id,
        parentCategorySlug: programmingTech_websiteMaintenance_category.slug,
        icon: '',
        title: 'Speed Optimization',
        slug: 'speed-optimization',
        url: `${programmingTech_websiteMaintenance_category.url}/speed-optimization`,
        description: '',
      },
    ];

    const programmingTech_aiDevelopment_subCategory = [
      {
        id: 'cdd32bfa-dcf7-4699-bc77-bf467c6ed7a4',
        parentCategoryId: programmingTech_aiDevelopment_category.id,
        parentCategorySlug: programmingTech_aiDevelopment_category.slug,
        icon: '',
        title: 'AI Websites & Software',
        slug: 'ai-websites-software',
        url: `${programmingTech_aiDevelopment_category.url}/ai-websites-software`,
        description: '',
      },

      {
        id: '5b4b7a34-9b8f-4b1b-b3e6-30f99eb10061',
        parentCategoryId: programmingTech_aiDevelopment_category.id,
        parentCategorySlug: programmingTech_aiDevelopment_category.slug,
        icon: '',
        title: 'AI Mobile Apps',
        slug: 'ai-mobile-apps',
        url: `${programmingTech_aiDevelopment_category.url}/ai-mobile-apps`,
        description: '',
      },

      {
        id: 'b0a634f9-cd88-4198-a4bc-c65ad9f1e27e',
        parentCategoryId: programmingTech_aiDevelopment_category.id,
        parentCategorySlug: programmingTech_aiDevelopment_category.slug,
        icon: '',
        title: 'AI Integrations',
        slug: 'ai-integrations',
        url: `${programmingTech_aiDevelopment_category.url}/ai-integrations`,
        description: '',
      },

      {
        id: '71c87f2e-9a31-4b55-b43e-c29b2b8762fc',
        parentCategoryId: programmingTech_aiDevelopment_category.id,
        parentCategorySlug: programmingTech_aiDevelopment_category.slug,
        icon: '',
        title: 'AI Agents',
        slug: 'ai-agents',
        url: `${programmingTech_aiDevelopment_category.url}/ai-agents`,
        description: '',
      },

      {
        id: '7fe47cd4-c76d-4f27-90c3-c1d8a93bba32',
        parentCategoryId: programmingTech_aiDevelopment_category.id,
        parentCategorySlug: programmingTech_aiDevelopment_category.slug,
        icon: '',
        title: 'AI Fine-Tuning',
        slug: 'ai-fine-tuning',
        url: `${programmingTech_aiDevelopment_category.url}/ai-fine-tuning`,
        description: '',
      },

      {
        id: '1119f032-c299-4403-9d1f-e63a06433b35',
        parentCategoryId: programmingTech_aiDevelopment_category.id,
        parentCategorySlug: programmingTech_aiDevelopment_category.slug,
        icon: '',
        title: 'AI Technology Consulting',
        slug: 'ai-technology-consulting',
        url: `${programmingTech_aiDevelopment_category.url}/ai-technology-consulting`,
        description: '',
      },
    ];

    const programmingTech_chatbotDevelopment_subCategory = [
      {
        id: 'f97d0a92-30c1-4e7f-83c4-276acbce098e',
        parentCategoryId: programmingTech_chatbotDevelopment_category.id,
        parentCategorySlug: programmingTech_chatbotDevelopment_category.slug,
        icon: '',
        title: 'AI Chatbot',
        slug: 'ai-chatbot',
        url: `${programmingTech_chatbotDevelopment_category.url}/ai-chatbot`,
        description: '',
      },

      {
        id: 'd7b799b6-975f-49d3-a33d-5b462a7a9b87',
        parentCategoryId: programmingTech_chatbotDevelopment_category.id,
        parentCategorySlug: programmingTech_chatbotDevelopment_category.slug,
        icon: '',
        title: 'Rules Based Chatbot',
        slug: 'rules-based-chatbot',
        url: `${programmingTech_chatbotDevelopment_category.url}/rules-based-chatbot`,
        description: '',
      },

      {
        id: 'e68555d7-b48c-4007-8830-b57fe9f88ff0',
        parentCategoryId: programmingTech_chatbotDevelopment_category.id,
        parentCategorySlug: programmingTech_chatbotDevelopment_category.slug,
        icon: '',
        title: 'Discord',
        slug: 'discord',
        url: `${programmingTech_chatbotDevelopment_category.url}/discord`,
        description: '',
      },

      {
        id: '07dce4e0-12f7-497d-bb44-b7d4979efed0',
        parentCategoryId: programmingTech_chatbotDevelopment_category.id,
        parentCategorySlug: programmingTech_chatbotDevelopment_category.slug,
        icon: '',
        title: 'Telegram',
        slug: 'telegram',
        url: `${programmingTech_chatbotDevelopment_category.url}/telegram`,
        description: '',
      },
    ];

    const programmingTech_gameDevelopment_subCategory = [
      {
        id: '3ed72dfd-89ed-4685-a91c-cb47820c1578',
        parentCategoryId: programmingTech_gameDevelopment_category.id,
        parentCategorySlug: programmingTech_gameDevelopment_category.slug,
        icon: '',
        title: 'Gameplay Experience & Feedback',
        slug: 'gameplay-experience-feedback',
        url: `${programmingTech_gameDevelopment_category.url}/gameplay-experience-feedback`,
        description: '',
      },

      {
        id: '54238f60-bc1b-4b59-a028-cd0977087cb9',
        parentCategoryId: programmingTech_gameDevelopment_category.id,
        parentCategorySlug: programmingTech_gameDevelopment_category.slug,
        icon: '',
        title: 'PC Games',
        slug: 'pc-games',
        url: `${programmingTech_gameDevelopment_category.url}/pc-games`,
        description: '',
      },

      {
        id: 'c7f79b9d-b40b-4ac1-a9bb-d98adfc727ea',
        parentCategoryId: programmingTech_gameDevelopment_category.id,
        parentCategorySlug: programmingTech_gameDevelopment_category.slug,
        icon: '',
        title: 'Mobile Games',
        slug: 'mobile-games',
        url: `${programmingTech_gameDevelopment_category.url}/mobile-games`,
        description: '',
      },

      {
        id: 'bf90a7bf-ca86-42b6-bb33-9869ecc79182',
        parentCategoryId: programmingTech_gameDevelopment_category.id,
        parentCategorySlug: programmingTech_gameDevelopment_category.slug,
        icon: 'https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/148a459235c2efcccf74882dd6790246-1727083583542/Unity%20Developers.png',
        title: 'Unity Developers',
        slug: 'unity',
        url: `${programmingTech_gameDevelopment_category.url}/unity`,
        description:
          'Find the best Unity game developers services you need to help you successfully meet your project planning goals and deadline.',
      },
    ];

    const programmingTech_mobileAppDevelopment_subCategory = [
      {
        id: '1a57b82b-019b-44e6-9e8b-89d5b703e4ea',
        parentCategoryId: programmingTech_mobileAppDevelopment_category.id,
        parentCategorySlug: programmingTech_mobileAppDevelopment_category.slug,
        icon: '',
        title: 'Cross-platform Development',
        slug: 'cross-platform-development',
        url: `${programmingTech_mobileAppDevelopment_category.url}/cross-platform-development`,
        description: '',
      },

      {
        id: '2d3a0e3d-157a-43bb-bbe6-5f06b4bb75b1',
        parentCategoryId: programmingTech_mobileAppDevelopment_category.id,
        parentCategorySlug: programmingTech_mobileAppDevelopment_category.slug,
        icon: 'https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/1857ea6cdffed9de2c5739f010338061-1727172011179/Android%20App%20Development.png',
        title: 'Android App Developers',
        slug: 'android',
        url: `${programmingTech_mobileAppDevelopment_category.url}/android`,
        description: 'Go mobile with custom Android apps.',
      },

      {
        id: 'ad63965a-5cc2-4520-8c5a-b5d08bc30f5f',
        parentCategoryId: programmingTech_mobileAppDevelopment_category.id,
        parentCategorySlug: programmingTech_mobileAppDevelopment_category.slug,
        icon: 'https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/1857ea6cdffed9de2c5739f010338061-1727172011194/iOS%20App%20Development.png',
        title: 'iOS App Developers',
        slug: 'ios',
        url: `${programmingTech_mobileAppDevelopment_category.url}/ios`,
        description: 'Go mobile with custom iOS apps.',
      },

      {
        id: 'd5c7db1f-f6d7-4b3b-a2c7-b8c5c25ec599',
        parentCategoryId: programmingTech_mobileAppDevelopment_category.id,
        parentCategorySlug: programmingTech_mobileAppDevelopment_category.slug,
        icon: '',
        title: 'Website to App',
        slug: 'website-to-app',
        url: `${programmingTech_mobileAppDevelopment_category.url}/website-to-app`,
        description: '',
      },

      {
        id: '50ae8b27-b064-4c1f-a7e7-d0ebd30a2db6',
        parentCategoryId: programmingTech_mobileAppDevelopment_category.id,
        parentCategorySlug: programmingTech_mobileAppDevelopment_category.slug,
        icon: '',
        title: 'Mobile App Maintenance',
        slug: 'mobile-app-maintenance',
        url: `${programmingTech_mobileAppDevelopment_category.url}/mobile-app-maintenance`,
        description: '',
      },

      {
        id: '1897200f-88b5-4c7c-b9e9-e3f0f83ed2d0',
        parentCategoryId: programmingTech_mobileAppDevelopment_category.id,
        parentCategorySlug: programmingTech_mobileAppDevelopment_category.slug,
        icon: '',
        title: 'VR & AR Development',
        slug: 'vr-ar-development',
        url: `${programmingTech_mobileAppDevelopment_category.url}/vr-ar-development`,
        description: '',
      },
    ];

    const programmingTech_cloudCybersecurity_subCategory = [
      {
        id: 'b4f3c59e-d319-4edb-a062-5f8c4d37f6e0',
        parentCategoryId: programmingTech_cloudCybersecurity_category.id,
        parentCategorySlug: programmingTech_cloudCybersecurity_category.slug,
        icon: '',
        title: 'Cloud Computing',
        slug: 'cloud-computing',
        url: `${programmingTech_cloudCybersecurity_category.url}/cloud-computing`,
        description: '',
      },

      {
        id: 'f4c03b78-54d4-4971-9dbb-42e7e58d70f1',
        parentCategoryId: programmingTech_cloudCybersecurity_category.id,
        parentCategorySlug: programmingTech_cloudCybersecurity_category.slug,
        icon: '',
        title: 'DevOps Engineering',
        slug: 'devops-engineering',
        url: `${programmingTech_cloudCybersecurity_category.url}/devops-engineering`,
        description: '',
      },

      {
        id: 'a7596f43-c70c-4878-a48a-2a76e61cf97b',
        parentCategoryId: programmingTech_cloudCybersecurity_category.id,
        parentCategorySlug: programmingTech_cloudCybersecurity_category.slug,
        icon: '',
        title: 'Cybersecurity',
        slug: 'cybersecurity',
        url: `${programmingTech_cloudCybersecurity_category.url}/cybersecurity`,
        description: '',
      },
    ];

    const programmingTech_datascienceMachineLearning_subCategory = [
      {
        id: 'f82ff9b7-56be-4e27-8f6f-053d66e3dff9',
        parentCategoryId:
          programmingTech_datascienceMachineLearning_category.id,
        parentCategorySlug:
          programmingTech_datascienceMachineLearning_category.slug,
        icon: '',
        title: 'Machine Learning',
        slug: 'machine-learning',
        url: `${programmingTech_datascienceMachineLearning_category.url}/machine-learning`,
        description: '',
      },

      {
        id: 'ce65cbe1-c3cc-47b4-8312-28259b8970fd',
        parentCategoryId:
          programmingTech_datascienceMachineLearning_category.id,
        parentCategorySlug:
          programmingTech_datascienceMachineLearning_category.slug,
        icon: '',
        title: 'Computer Vision',
        slug: 'computer-vision',
        url: `${programmingTech_datascienceMachineLearning_category.url}/computer-vision`,
        description: '',
      },

      {
        id: '83a86a91-66a6-4b24-8a6c-303f36fe52b0',
        parentCategoryId:
          programmingTech_datascienceMachineLearning_category.id,
        parentCategorySlug:
          programmingTech_datascienceMachineLearning_category.slug,
        icon: '',
        title: 'NLP (Natural Language Processing)',
        slug: 'nlp-natural-language-processing',
        url: `${programmingTech_datascienceMachineLearning_category.url}/nlp-natural-language-processing`,
        description: '',
      },

      {
        id: 'ce3f3027-dcf1-408f-88d5-b706620f0be0',
        parentCategoryId:
          programmingTech_datascienceMachineLearning_category.id,
        parentCategorySlug:
          programmingTech_datascienceMachineLearning_category.slug,
        icon: '',
        title: 'Deep Learning',
        slug: 'deep-learning',
        url: `${programmingTech_datascienceMachineLearning_category.url}/deep-learning`,
        description: '',
      },
    ];

    const programmingTech_softwareDevelopment_subCategory = [
      {
        id: '70ed0547-7d79-460e-bb51-97c1b65e3df7',
        parentCategoryId: programmingTech_softwareDevelopment_category.id,
        parentCategorySlug: programmingTech_softwareDevelopment_category.slug,
        icon: '',
        title: 'Web Applications',
        slug: 'web-applications',
        url: `${programmingTech_softwareDevelopment_category.url}/web-applications`,
        description: '',
      },

      {
        id: '76423207-3068-4cf1-8a60-4a8f2311a535',
        parentCategoryId: programmingTech_softwareDevelopment_category.id,
        parentCategorySlug: programmingTech_softwareDevelopment_category.slug,
        icon: '',
        title: 'Desktop Applications',
        slug: 'desktop-applications',
        url: `${programmingTech_softwareDevelopment_category.url}/desktop-applications`,
        description: '',
      },

      {
        id: '85ab2385-b1d5-46d1-80b5-2ee25b35d1ed',
        parentCategoryId: programmingTech_softwareDevelopment_category.id,
        parentCategorySlug: programmingTech_softwareDevelopment_category.slug,
        icon: '',
        title: 'Automations & Workflows',
        slug: 'automations-workflows',
        url: `${programmingTech_softwareDevelopment_category.url}/automations-workflows`,
        description: '',
      },

      {
        id: 'bf0878bb-b56c-49ad-8366-6d7ca3d77b8d',
        parentCategoryId: programmingTech_softwareDevelopment_category.id,
        parentCategorySlug: programmingTech_softwareDevelopment_category.slug,
        icon: '',
        title: 'APIs & Integrations',
        slug: 'apis-integrations',
        url: `${programmingTech_softwareDevelopment_category.url}/apis-integrations`,
        description: '',
      },

      {
        id: '9ccf2530-76f1-47d4-b3a9-4d1c8a85cc09',
        parentCategoryId: programmingTech_softwareDevelopment_category.id,
        parentCategorySlug: programmingTech_softwareDevelopment_category.slug,
        icon: '',
        title: 'Databases',
        slug: 'databases',
        url: `${programmingTech_softwareDevelopment_category.url}/databases`,
        description: '',
      },

      {
        id: '380c02a5-cd72-44b3-b657-bb3c47724376',
        parentCategoryId: programmingTech_softwareDevelopment_category.id,
        parentCategorySlug: programmingTech_softwareDevelopment_category.slug,
        icon: '',
        title: 'Scripting',
        slug: 'scripting',
        url: `${programmingTech_softwareDevelopment_category.url}/scripting`,
        description: '',
      },

      {
        id: '5ecfe1ff-bcd5-4638-b8d5-8b89f5b5f649',
        parentCategoryId: programmingTech_softwareDevelopment_category.id,
        parentCategorySlug: programmingTech_softwareDevelopment_category.slug,
        icon: '',
        title: 'QA & Review',
        slug: 'qa-review',
        url: `${programmingTech_softwareDevelopment_category.url}/qa-review`,
        description: '',
      },

      {
        id: '3f927240-4426-4b98-a9c3-524fa2fffe64',
        parentCategoryId: programmingTech_softwareDevelopment_category.id,
        parentCategorySlug: programmingTech_softwareDevelopment_category.slug,
        icon: '',
        title: 'User Testing',
        slug: 'user-testing',
        url: `${programmingTech_softwareDevelopment_category.url}/user-testing`,
        description: '',
      },
    ];

    const categories: DeepPartial<CategoryEntity>[] = [
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

    await this.repository.save(categories);

    console.log('Seeded Categories!');
  }
}
