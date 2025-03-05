interface Language {
     code: string;
     level: number;
 }
 
 interface RecurringOption {
     id: string;
     discount_percentage: number;
 }
 
 interface Metadata {
     type: string;
     value: string[];
 }
 
 interface SellerRating {
     count: number;
     score: number;
 }
 
 interface Asset {
     cloud_img_main_gig: string;
     type: string;
     id: string;
 }
 
 interface Gig {
     gig_id: number;
     category_id: number;
     sub_category_id: number;
     nested_sub_category_id: number;
     is_pro: boolean;
     is_featured: boolean;
     cached_slug: string;
     title: string;
     seller_name: string;
     seller_id: number;
     seller_country: string;
     seller_img: string;
     seller_display_name: string;
     seller_online: boolean;
     status: string;
     offer_consultation: boolean;
     assets: Asset[];
     choice_eligibilities: any; // Có thể thay đổi nếu cần cụ thể hơn
     seller_languages: Language[];
     recurring_options: RecurringOption[];
     metadata: Metadata[];
     personalized_pricing_fail: boolean;
     has_recurring_option: boolean;
     buying_review_rating_count: number;
     buying_review_rating: number;
     seller_url: string;
     seller_level: string;
     seller_rating: SellerRating;
     gig_url: string;
     is_seller_unavailable: boolean;
     price_i: number;
     package_i: number;
     extra_fast: boolean;
     num_of_packages: number;
     gigQueryParams: object;
 }
 
 interface GigsResponse {
     gigs: Gig[];
 }
 
 const gigsData: GigsResponse = {
     gigs: [
         {
             gig_id: 383458389,
             category_id: 10,
             sub_category_id: 514,
             nested_sub_category_id: 2610,
             is_pro: false,
             is_featured: false,
             cached_slug: "develop-design-and-build-your-shopify-dropshipping-store-products-and-websites",
             title: "build shopify website design shopify dropshipping website and store expert",
             seller_name: "muhammadzees904",
             seller_id: 112957947,
             seller_country: "PK",
             seller_img: "https://fiverr-res.cloudinary.com/t_profile_thumb,q_auto,f_auto/attachments/profile/photo/8b80c16329e5ab43bbdbdc1a3481e03a-1650109930074/f11a518b-014f-4f6e-a574-d293b9adf6c6.jpg",
             seller_display_name: "Zeeshanijaz",
             seller_online: true,
             status: "APPROVED",
             offer_consultation: true,
             assets: [
                 {
                     cloud_img_main_gig: "https://fiverr-res.cloudinary.com/t_main1,q_auto,f_auto/gigs/383458389/original/fab76c956c771303e4d71c97aef870a3c1a49deb.jpg",
                     type: "ImageAsset",
                     id: "383458389_1"
                 }
             ],
             choice_eligibilities: null,
             seller_languages: [
                 { code: "en", level: 3 },
                 { code: "de", level: 2 },
                 { code: "ru", level: 2 },
                 { code: "fr", level: 2 }
             ],
             recurring_options: [
                 { id: "674c9b15bbbff600013024c4", discount_percentage: 10 },
                 { id: "674c9b15bbbff600013024c5", discount_percentage: 15 }
             ],
             metadata: [
                 { type: "website_type", value: ["e_commerce"] },
                 { type: "website_features", value: ["payment", "customer_support", "shipping", "video", "form", "events", "music", "map", "faq", "gallery"] },
                 { type: "plugins", value: ["free_shipping_bar", "product_reviews", "product_filter_search", "store_locator", "pagefly"] }
             ],
             personalized_pricing_fail: false,
             has_recurring_option: true,
             buying_review_rating_count: 107,
             buying_review_rating: 5,
             seller_url: "/muhammadzees904",
             seller_level: "level_two_seller",
             seller_rating: { count: 107, score: 5 },
             gig_url: "/muhammadzees904/develop-design-and-build-your-shopify-dropshipping-store-products-and-websites",
             is_seller_unavailable: false,
             price_i: 80,
             package_i: 1,
             extra_fast: false,
             num_of_packages: 3,
             gigQueryParams: {}
         }
     ]
 };
 