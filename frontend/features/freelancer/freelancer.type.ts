enum FreelancerRankEnum {
  NEW = "NEW",
  LEVEL1 = "LEVEL1",
  LEVEL2 = "LEVEL2",
  LEVEL3 = "LEVEL3",
}

enum FreelancerSkillProficiency {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  ADVANCED = "Advanced",
}

enum FreelancerLanguageProficiency {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  ADVANCED = "Advanced",
  FLUENT = "Fluent",
}

interface FreelancerLanguage {
  id: number;
  alpha3: string;
  name: string;
  proficiency: FreelancerLanguageProficiency;
}

interface FreelancerSkill {
  id: number;
  name: string;
  proficiency: FreelancerSkillProficiency;
}

interface FreelancerProfile {
  displayName: string;
  createdAt: string;
  id: string;
  email: string;
  country: string;
  userId: string;
  level: FreelancerRankEnum;
  bio: string;
  avatar: string;
  phone: string;
  freelancersLanguages: FreelancerLanguage[];
  freelancersSkills: FreelancerSkill[];
  reviewCount: number;
  completedOrderCount: number;
  earnings: string;
  withdrawnAmount: string;
  completedRate: string;
  reviews?: {
    id: number;
    username: string;
    rating: number;
    comment: string;
  }[];
  gigs?: {
    id: number;
    title: string;
    description: string;
    price: number;
    deliveryTime: string;
    revisions: number;
    rating: number;
    reviews: number;
    createdAt: string;
    updatedAt: string;
    userId: string;
    freelancerId: string;
    status: string;
  }[];
}
