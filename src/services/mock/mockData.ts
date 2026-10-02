import {
  AppUser,
  ShopperUser,
  SellerUser,
  ShoppingHelperUser,
  SubAdminUser,
  AdminUser,
  ProductCategory,
  Product,
  Address,
  ShoppingRequest,
  Order,
  AppNotification,
  ChatMessage,
  Transaction,
  SellerHelperApplication,
  AvailableHelper
} from '../../types';

export const HERO_BANNER_IMAGE = '/src/assets/images/shoplink_hero_banner_1790775074898.jpg';
export const GROCERIES_IMAGE = '/src/assets/images/nigerian_groceries_display_1790775092172.jpg';
export const FRESH_FOOD_IMAGE = '/src/assets/images/nigerian_fresh_food_1790775104966.jpg';

// Pre-defined users for each role
export const MOCK_USERS: Record<string, AppUser> = {
  shopper: {
    id: 'user_shopper_01',
    name: 'Micah Adeyemi',
    email: 'micah.adeyemi@example.ng',
    phone: '+234 802 345 6789',
    role: 'SHOPPER',
    status: 'ACTIVE',
    createdAt: '2026-01-15T09:00:00Z',
    locationArea: 'Ikeja GRA, Lagos',
    residentialAddress: '12 Isaac John Street, Ikeja GRA, Lagos',
    defaultAddressId: 'addr_01',
    loyaltyPoints: 340,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    kyc: {
      status: 'NOT_SUBMITTED',
      tier: 'TIER_0_UNVERIFIED'
    }
  } as ShopperUser,

  seller: {
    id: 'user_seller_01',
    name: 'Alhaja Basirat Stores',
    email: 'basirat.provisions@example.ng',
    phone: '+234 803 111 2233',
    role: 'SELLER',
    status: 'ACTIVE',
    createdAt: '2025-11-20T10:00:00Z',
    locationArea: 'Allen Avenue, Ikeja, Lagos',
    residentialAddress: '14 Allen Avenue, Opposite Ikeja Mall, Lagos',
    storeName: 'Basirat Super Provisions & Foodstuffs',
    storeDescription: 'Direct distributor of staple grains, oils, dairy, and household essentials in Ikeja.',
    storeAddress: '14 Allen Avenue, Opposite Ikeja Mall, Lagos',
    businessRegNumber: 'BN-2849102',
    isOpen: true,
    rating: 4.8,
    totalSalesCount: 842,
    bannerUrl: HERO_BANNER_IMAGE,
    helperApplicationStatus: 'NONE',
    isMergedSellerHelper: false,
    activeWorkspace: 'SELLER',
    kyc: {
      status: 'UNDER_REVIEW',
      tier: 'TIER_1_BASIC',
      idType: 'CAC_CERTIFICATE',
      idNumber: 'BN-2849102',
      bvn: '22345678901',
      dateOfBirth: '1984-06-15',
      residentialAddress: '14 Allen Avenue, Ikeja, Lagos',
      stateOfResidence: 'Lagos',
      lga: 'Ikeja',
      documentFileName: 'basirat_cac_incorporation.pdf',
      submittedAt: '2026-02-10T14:30:00Z'
    }
  } as SellerUser,

  merged_seller_helper: {
    id: 'user_merged_seller_helper_01',
    name: 'Chinedu Okeke',
    email: 'chinedu.enterprises@example.ng',
    phone: '+234 805 444 3322',
    role: 'SELLER',
    status: 'ACTIVE',
    createdAt: '2025-09-10T11:00:00Z',
    locationArea: 'Opebi / Ikeja, Lagos',
    residentialAddress: '8 Opebi Road, Ikeja, Lagos',
    storeName: 'Chinedu Foodstuff & Dispatch Express',
    storeDescription: 'Wholesale grains and instant market shopping helper runs in Opebi and Ikeja.',
    storeAddress: '8 Opebi Road, Ikeja, Lagos',
    businessRegNumber: 'BN-4920194',
    isOpen: true,
    rating: 4.9,
    totalSalesCount: 512,
    bannerUrl: HERO_BANNER_IMAGE,
    isMergedSellerHelper: true,
    helperApplicationStatus: 'APPROVED',
    activeWorkspace: 'SELLER',
    helperVehicleType: 'Motorcycle',
    helperServiceAreas: ['Opebi', 'Allen Avenue', 'Ikeja GRA', 'Maryland'],
    helperRating: 4.85,
    helperCompletedJobsCount: 94,
    helperTotalEarningsNaira: 168500,
    isHelperAvailable: true,
    kyc: {
      status: 'VERIFIED',
      tier: 'TIER_2_VERIFIED',
      idType: 'NIN_CARD',
      idNumber: '74829103847',
      bvn: '22883344556',
      dateOfBirth: '1989-11-22',
      residentialAddress: '8 Opebi Road, Ikeja, Lagos',
      stateOfResidence: 'Lagos',
      lga: 'Ikeja',
      documentFileName: 'chinedu_nin_verified.jpg',
      submittedAt: '2025-09-12T10:00:00Z',
      verifiedAt: '2025-09-13T16:00:00Z',
      verifiedBy: 'National Admin (Emeka Okonkwo)'
    }
  } as SellerUser,

  helper: {
    id: 'user_helper_01',
    name: 'Babatunde "Tunde" Ojo',
    email: 'tunde.shopper@example.ng',
    phone: '+234 814 987 6543',
    role: 'SHOPPING_HELPER',
    status: 'ACTIVE',
    createdAt: '2025-12-05T08:30:00Z',
    locationArea: 'Ikeja / Maryland, Lagos',
    residentialAddress: '3 Kudirat Abiola Way, Oregun, Ikeja',
    isAvailable: true,
    serviceAreas: ['Ikeja GRA', 'Allen Avenue', 'Maryland', 'Opebi', 'Alausa'],
    rating: 4.9,
    completedJobsCount: 218,
    totalEarningsNaira: 382500,
    currentWorkload: 1,
    vehicleType: 'Motorcycle',
    approxLocation: {
      lat: 6.5925,
      lng: 3.3542,
      areaName: 'Near Ikeja City Mall'
    },
    kyc: {
      status: 'VERIFIED',
      tier: 'TIER_2_VERIFIED',
      idType: 'DRIVERS_LICENSE',
      idNumber: 'LAG-839201948',
      bvn: '22774411990',
      dateOfBirth: '1993-04-18',
      residentialAddress: '3 Kudirat Abiola Way, Oregun, Ikeja',
      stateOfResidence: 'Lagos',
      lga: 'Ikeja',
      documentFileName: 'tunde_frsc_drivers_license.jpg',
      submittedAt: '2025-12-06T09:00:00Z',
      verifiedAt: '2025-12-07T11:00:00Z',
      verifiedBy: 'National Admin (Emeka Okonkwo)'
    }
  } as ShoppingHelperUser,

  subAdmin: {
    id: 'user_subadmin_01',
    name: 'Ngozi Eze',
    email: 'ngozi.eze@shoplink.ng',
    phone: '+234 806 777 8899',
    role: 'SUB_ADMIN',
    status: 'ACTIVE',
    createdAt: '2025-10-01T12:00:00Z',
    locationArea: 'Lagos Island & Mainland Operations',
    residentialAddress: '24 Marina, Lagos Island',
    assignedZone: 'Lagos Mainland Zone 1',
    activeSupervisedRequestsCount: 14,
    kyc: {
      status: 'VERIFIED',
      tier: 'TIER_3_PREMIUM',
      idType: 'INTERNATIONAL_PASSPORT',
      idNumber: 'A08920194',
      bvn: '22998877112',
      dateOfBirth: '1987-08-14',
      residentialAddress: '24 Marina, Lagos Island',
      stateOfResidence: 'Lagos',
      lga: 'Lagos Island',
      documentFileName: 'ngozi_passport_verified.pdf',
      submittedAt: '2025-10-02T10:00:00Z',
      verifiedAt: '2025-10-02T14:00:00Z',
      verifiedBy: 'National Admin (Emeka Okonkwo)'
    }
  } as SubAdminUser,

  admin: {
    id: 'user_admin_01',
    name: 'Emeka Okonkwo',
    email: 'admin@shoplink.ng',
    phone: '+234 809 000 1122',
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: '2025-08-10T09:00:00Z',
    locationArea: 'Victoria Island, Lagos',
    residentialAddress: '15 Adeola Odeku Street, Victoria Island, Lagos',
    isMasterAdmin: true,
    kyc: {
      status: 'VERIFIED',
      tier: 'TIER_3_PREMIUM',
      idType: 'INTERNATIONAL_PASSPORT',
      idNumber: 'A01948201',
      bvn: '22110099887',
      dateOfBirth: '1980-03-25',
      residentialAddress: '15 Adeola Odeku Street, Victoria Island, Lagos',
      stateOfResidence: 'Lagos',
      lga: 'Eti-Osa',
      documentFileName: 'emeka_diplomatic_passport.pdf',
      submittedAt: '2025-08-10T09:30:00Z',
      verifiedAt: '2025-08-10T10:00:00Z',
      verifiedBy: 'National Identity Commission (NIMC Enterprise)'
    }
  } as AdminUser
};

export const MOCK_CATEGORIES: ProductCategory[] = [
  { id: 'cat_gadgets', name: 'Gadgets & Devices', iconName: 'Smartphone', itemCount: 320, color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400' },
  { id: 'cat_computers', name: 'Computers & Laptops', iconName: 'Laptop', itemCount: 185, color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400' },
  { id: 'cat_vehicles', name: 'Vehicles & Autos', iconName: 'Car', itemCount: 140, color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' },
  { id: 'cat_fashion', name: 'Fashion & Wears', iconName: 'Shirt', itemCount: 410, color: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400' },
  { id: 'cat_services', name: 'Services & Repairs', iconName: 'Wrench', itemCount: 95, color: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400' },
  { id: 'cat_groceries', name: 'Groceries & Foodstuffs', iconName: 'ShoppingBag', itemCount: 280, color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' },
  { id: 'cat_electronics', name: 'Home & Electronics', iconName: 'Tv', itemCount: 215, color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400' },
  { id: 'cat_health', name: 'Health & Beauty', iconName: 'Sparkles', itemCount: 160, color: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400' }
];

export const MOCK_PRODUCTS: Product[] = [
  // --- Gadgets & Devices ---
  {
    id: 'prod_gadget_01',
    name: 'Apple iPhone 16 Pro Max (256GB, 5G)',
    category: 'Gadgets & Devices',
    price: 2450000,
    originalPrice: 2600000,
    description: 'Brand new factory-unlocked iPhone 16 Pro Max in Desert Titanium with Apple A18 Pro Bionic chip, 48MP camera, and 1-year warranty.',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800&auto=format&fit=crop'
    ],
    sellerId: 'user_seller_tech_01',
    sellerName: 'Slot Systems & Tech Village',
    sellerRating: 4.9,
    sellerLocation: 'Computer Village, Otigba St, Ikeja',
    stockQuantity: 15,
    isAvailable: true,
    unit: '1 Device with Box & Accessories',
    featured: true,
    popular: true
  },
  {
    id: 'prod_gadget_02',
    name: 'Samsung Galaxy S24 Ultra 5G (512GB)',
    category: 'Gadgets & Devices',
    price: 1980000,
    originalPrice: 2150000,
    description: 'Titanium Black flagship with built-in S-Pen, Galaxy AI live translation, Snapdragon 8 Gen 3, and 200MP camera zoom.',
    imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop'
    ],
    sellerId: 'user_seller_tech_01',
    sellerName: 'Slot Systems & Tech Village',
    sellerRating: 4.9,
    sellerLocation: 'Computer Village, Otigba St, Ikeja',
    stockQuantity: 12,
    isAvailable: true,
    unit: '1 Device (Dual SIM)',
    featured: true,
    popular: true
  },
  {
    id: 'prod_gadget_03',
    name: 'Apple AirPods Pro (2nd Gen, USB-C MagSafe)',
    category: 'Gadgets & Devices',
    price: 385000,
    originalPrice: 420000,
    description: 'Active Noise Cancellation, Adaptive Audio, Transparency mode, personalized spatial audio, and USB-C MagSafe charging case.',
    imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop'
    ],
    sellerId: 'user_seller_tech_01',
    sellerName: 'Slot Systems & Tech Village',
    sellerRating: 4.9,
    sellerLocation: 'Computer Village, Otigba St, Ikeja',
    stockQuantity: 28,
    isAvailable: true,
    unit: 'Complete Pair in Box',
    popular: true
  },
  {
    id: 'prod_gadget_04',
    name: 'Oraimo FreePods 4 ANC Wireless Earbuds',
    category: 'Gadgets & Devices',
    price: 34500,
    originalPrice: 38000,
    description: 'Active Noise Cancellation, low latency gaming mode, 35.5 hours playtime, transparency mode, and rich Nigerian Afrobeats tuned sound.',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=800&auto=format&fit=crop'
    ],
    sellerId: 'user_seller_tech_01',
    sellerName: 'Slot Systems & Tech Village',
    sellerRating: 4.9,
    sellerLocation: 'Computer Village, Otigba St, Ikeja',
    stockQuantity: 45,
    isAvailable: true,
    unit: '1 Unit',
    popular: true
  },

  // --- Computers & Laptops ---
  {
    id: 'prod_comp_01',
    name: 'Apple MacBook Pro 14" M3 (16GB RAM, 512GB SSD)',
    category: 'Computers & Laptops',
    price: 2850000,
    originalPrice: 3100000,
    description: 'Liquid Retina XDR display, Apple M3 chip with 8-core CPU and 10-core GPU, 18 hours battery life, Space Gray color.',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop'
    ],
    sellerId: 'user_seller_tech_01',
    sellerName: 'Slot Systems & Tech Village',
    sellerRating: 4.9,
    sellerLocation: 'Computer Village, Otigba St, Ikeja',
    stockQuantity: 8,
    isAvailable: true,
    unit: '1 Laptop (Sealed in Box)',
    featured: true,
    popular: true
  },
  {
    id: 'prod_comp_02',
    name: 'HP Pavilion 15 Touchscreen Core i7 (16GB, 1TB SSD)',
    category: 'Computers & Laptops',
    price: 980000,
    originalPrice: 1100000,
    description: '13th Gen Intel Core i7, 16GB DDR5 RAM, 1TB PCIe NVMe SSD, backlit keyboard, FHD IPS micro-edge touchscreen, Windows 11 Pro.',
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop'
    ],
    sellerId: 'user_seller_tech_01',
    sellerName: 'Slot Systems & Tech Village',
    sellerRating: 4.9,
    sellerLocation: 'Computer Village, Otigba St, Ikeja',
    stockQuantity: 14,
    isAvailable: true,
    unit: '1 Laptop & Charger',
    popular: true
  },
  {
    id: 'prod_comp_03',
    name: 'Dell UltraSharp 27" 4K UHD IPS Monitor',
    category: 'Computers & Laptops',
    price: 595000,
    originalPrice: 650000,
    description: 'Factory-calibrated 98% DCI-P3 color accuracy, USB-C 90W power delivery, HDMI, DisplayPort, and tilt/swivel ergonomic stand.',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop'
    ],
    sellerId: 'user_seller_tech_01',
    sellerName: 'Slot Systems & Tech Village',
    sellerRating: 4.9,
    sellerLocation: 'Computer Village, Otigba St, Ikeja',
    stockQuantity: 10,
    isAvailable: true,
    unit: '1 Box with Cables'
  },

  // --- Vehicles & Autos ---
  {
    id: 'prod_veh_01',
    name: 'Toyota Corolla 2021 XLE Sedan (Tokunbo Verified)',
    category: 'Vehicles & Autos',
    price: 14800000,
    originalPrice: 15500000,
    description: 'Clean direct foreign-used (Tokunbo) Toyota Corolla XLE. Lagos port cleared with complete customs papers, leather interior, reverse camera, keyless entry.',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&auto=format&fit=crop'
    ],
    sellerId: 'user_seller_auto_01',
    sellerName: 'AutoBazaar Lagos Motors',
    sellerRating: 4.8,
    sellerLocation: 'Berger Bus Stop / Ikeja Axis',
    stockQuantity: 2,
    isAvailable: true,
    unit: '1 Registered Vehicle with Papers',
    featured: true,
    popular: true
  },
  {
    id: 'prod_veh_02',
    name: 'Lexus RX 350 AWD (Panoramic Roof, Lagos Cleared)',
    category: 'Vehicles & Autos',
    price: 19500000,
    originalPrice: 21000000,
    description: 'Ultra-luxurious Lexus RX 350 AWD with clean Carfax, unpainted exterior, chilled dual AC, navigation screen, and smooth 3.5L V6 engine.',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=800&auto=format&fit=crop'
    ],
    sellerId: 'user_seller_auto_01',
    sellerName: 'AutoBazaar Lagos Motors',
    sellerRating: 4.8,
    sellerLocation: 'Berger Bus Stop / Ikeja Axis',
    stockQuantity: 1,
    isAvailable: true,
    unit: '1 Vehicle Inspection Ready',
    featured: true
  },
  {
    id: 'prod_veh_03',
    name: 'Haojue 125cc Commercial Delivery Motorcycle (2024)',
    category: 'Vehicles & Autos',
    price: 1350000,
    originalPrice: 1450000,
    description: 'High-durability delivery motorbike with front disc brakes, fuel injection efficiency (up to 45km/L), and reinforced luggage carrier frame.',
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?w=800&auto=format&fit=crop'
    ],
    sellerId: 'user_seller_auto_01',
    sellerName: 'AutoBazaar Lagos Motors',
    sellerRating: 4.8,
    sellerLocation: 'Berger Bus Stop / Ikeja Axis',
    stockQuantity: 6,
    isAvailable: true,
    unit: '1 Bike with Warranty',
    popular: true
  },
  {
    id: 'prod_veh_04',
    name: 'Bosch Silver 12V 75Ah Heavy Duty Car Battery',
    category: 'Vehicles & Autos',
    price: 82000,
    originalPrice: 88000,
    description: 'Maintenance-free German-engineered high-cranking calcium-silver battery for extreme heat resilience and instant ignition start.',
    imageUrl: 'https://images.unsplash.com/photo-1598084999517-5e6341d3b006?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1598084999517-5e6341d3b006?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop'
    ],
    sellerId: 'user_seller_auto_01',
    sellerName: 'AutoBazaar Lagos Motors',
    sellerRating: 4.8,
    sellerLocation: 'Ladipo Auto Parts Market, Mushin',
    stockQuantity: 35,
    isAvailable: true,
    unit: '1 Battery (18 Months Warranty)'
  },

  // --- Fashion & Wears ---
  {
    id: 'prod_fash_01',
    name: 'Royal Hand-Embroidered 3-Piece Agbada Set',
    category: 'Fashion & Wears',
    price: 125000,
    originalPrice: 145000,
    description: 'Bespoke Nigerian luxury Agbada, Buba, and Sokoto tailored with authentic Aso-Oke neckline embroidery and comfortable breathable fabric.',
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop'
    ],
    sellerId: 'user_seller_fashion_01',
    sellerName: 'Deji & Kola Bespoke Fashion',
    sellerRating: 4.9,
    sellerLocation: 'Admiralty Way, Lekki Phase 1',
    stockQuantity: 20,
    isAvailable: true,
    unit: '3-Piece Set (Custom Fitted)',
    featured: true,
    popular: true
  },
  {
    id: 'prod_fash_02',
    name: 'Nike Air Jordan 1 Retro High OG (Chicago)',
    category: 'Fashion & Wears',
    price: 145000,
    originalPrice: 165000,
    description: 'Authentic classic high-top retro basketball sneakers with premium tumbled leather in the legendary red, black, and white colorway.',
    imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&auto=format&fit=crop'
    ],
    sellerId: 'user_seller_fashion_01',
    sellerName: 'Deji & Kola Bespoke Fashion',
    sellerRating: 4.9,
    sellerLocation: 'Admiralty Way, Lekki Phase 1',
    stockQuantity: 18,
    isAvailable: true,
    unit: '1 Pair with Box & Extra Laces',
    popular: true
  },
  {
    id: 'prod_fash_03',
    name: 'Original Swiss Voile Cotton Lace (5 Yards)',
    category: 'Fashion & Wears',
    price: 88000,
    originalPrice: 95000,
    description: 'Luxury 100% pure Swiss cotton lace fabric for weddings, owanbe, and high-fashion traditional outfits from Balogun Market.',
    imageUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop'
    ],
    sellerId: 'user_seller_fashion_01',
    sellerName: 'Deji & Kola Bespoke Fashion',
    sellerRating: 4.9,
    sellerLocation: 'Balogun Market, Lagos Island',
    stockQuantity: 25,
    isAvailable: true,
    unit: '5 Yards'
  },

  // --- Professional Services & Repairs ---
  {
    id: 'prod_serv_01',
    name: 'Pre-Purchase Vehicle Inspection & Computer Diagnostics',
    category: 'Services & Repairs',
    price: 30000,
    originalPrice: 35000,
    description: 'Certified Nigerian auto mechanic sends diagnostic team anywhere in Lagos. 120-point mechanical, electrical, OBD-II scan, and road test report before you pay for any Tokunbo vehicle.',
    imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop'
    ],
    sellerId: 'user_seller_service_01',
    sellerName: 'QuickFix Auto & Tech Services',
    sellerRating: 4.9,
    sellerLocation: 'Mobile Service Across Lagos & Abuja',
    stockQuantity: 100,
    isAvailable: true,
    unit: '1 Full Vehicle Inspection Session',
    featured: true,
    popular: true
  },
  {
    id: 'prod_serv_02',
    name: 'Express iPhone & Smartphone Screen / Battery Repair',
    category: 'Services & Repairs',
    price: 45000,
    description: 'Computer Village certified technician service. Original OLED screen or high-capacity battery installation completed within 45 minutes with 90-day warranty.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1597740985671-2a8a3b80532e?w=800&auto=format&fit=crop'
    ],
    sellerId: 'user_seller_service_01',
    sellerName: 'QuickFix Auto & Tech Services',
    sellerRating: 4.9,
    sellerLocation: 'Computer Village, Ikeja',
    stockQuantity: 50,
    isAvailable: true,
    unit: '1 Service Appointment with Parts'
  },
  {
    id: 'prod_serv_03',
    name: '5kVA Solar Inverter & Battery System Installation',
    category: 'Services & Repairs',
    price: 85000,
    originalPrice: 100000,
    description: 'Professional solar energy engineering service. Complete installation, surge protection, DC breaker cabling, and load segregation for uninterrupted 24/7 power.',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=800&auto=format&fit=crop'
    ],
    sellerId: 'user_seller_service_01',
    sellerName: 'QuickFix Auto & Tech Services',
    sellerRating: 4.9,
    sellerLocation: 'Lagos & Ogun State Wide',
    stockQuantity: 40,
    isAvailable: true,
    unit: '1 Home / Office Installation Service',
    featured: true
  },
  {
    id: 'prod_serv_04',
    name: 'Dedicated Lagos Market Errand Runner & Concierge',
    category: 'Services & Repairs',
    price: 15000,
    description: 'Hire an experienced verified shopping helper for half-day or full-day procurement across Computer Village, Ladipo, Balogun, or Mile 12 with live video confirmation.',
    imageUrl: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop'
    ],
    sellerId: 'user_seller_service_01',
    sellerName: 'QuickFix Auto & Tech Services',
    sellerRating: 4.9,
    sellerLocation: 'All Lagos Market Zones',
    stockQuantity: 50,
    isAvailable: true,
    unit: 'Half-Day Concierge Booking',
    popular: true
  },

  // --- Home & Electronics ---
  {
    id: 'prod_elec_01',
    name: 'Maxmech 3.5kVA Pure Copper Gasoline Generator',
    category: 'Home & Electronics',
    price: 340000,
    originalPrice: 375000,
    description: 'Heavy duty 100% pure copper coil alternator generator with electric key starter, low fuel consumption, and AVR voltage stabilizer for appliances.',
    imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop'
    ],
    sellerId: 'user_seller_01',
    sellerName: 'Basirat Super Provisions',
    sellerRating: 4.8,
    sellerLocation: 'Alaba International Market / Ikeja',
    stockQuantity: 15,
    isAvailable: true,
    unit: '1 Generator with Battery & Wheel Kit',
    popular: true
  },
  {
    id: 'prod_elec_02',
    name: 'LG 55" 4K UHD Smart AI ThinQ Television',
    category: 'Home & Electronics',
    price: 620000,
    originalPrice: 680000,
    description: 'Ultra HD HDR10 Pro display, webOS smart platform with Netflix, YouTube, Apple AirPlay, Magic Remote with voice control, and satellite receiver.',
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&auto=format&fit=crop'
    ],
    sellerId: 'user_seller_01',
    sellerName: 'Basirat Super Provisions',
    sellerRating: 4.8,
    sellerLocation: 'Alaba International Market / Ikeja',
    stockQuantity: 12,
    isAvailable: true,
    unit: '1 Television Box (2 Years Warranty)'
  },

  // --- Groceries & Foodstuffs ---
  {
    id: 'prod_groc_01',
    name: 'Mama Gold Superior Parboiled Rice (25kg Bag)',
    category: 'Groceries & Foodstuffs',
    price: 25000,
    originalPrice: 27500,
    description: 'Premium quality parboiled stone-free long grain rice. Clean, quick cooking, and delicious Nigerian household food staple.',
    imageUrl: GROCERIES_IMAGE,
    images: [
      GROCERIES_IMAGE,
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=800&auto=format&fit=crop'
    ],
    sellerId: 'user_seller_01',
    sellerName: 'Basirat Super Provisions & Foodstuffs',
    sellerRating: 4.8,
    sellerLocation: 'Allen Avenue, Ikeja',
    stockQuantity: 45,
    isAvailable: true,
    unit: '25kg Bag',
    popular: true
  },
  {
    id: 'prod_groc_02',
    name: 'Oloyin Brown Honey Beans (5kg Bag)',
    category: 'Groceries & Foodstuffs',
    price: 8500,
    originalPrice: 9200,
    description: 'Sweet Nigerian Oloyin honey beans. Stone-free, clean, fast-cooking, high protein staple for ewa aganyin.',
    imageUrl: GROCERIES_IMAGE,
    images: [
      GROCERIES_IMAGE,
      'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=800&auto=format&fit=crop'
    ],
    sellerId: 'user_seller_01',
    sellerName: 'Basirat Super Provisions & Foodstuffs',
    sellerRating: 4.8,
    sellerLocation: 'Allen Avenue, Ikeja',
    stockQuantity: 30,
    isAvailable: true,
    unit: '5kg Bag',
    popular: true
  },
  {
    id: 'prod_groc_03',
    name: "King's Pure Vegetable Cooking Oil (2 Litres)",
    category: 'Groceries & Foodstuffs',
    price: 7200,
    originalPrice: 7800,
    description: 'Cholesterol-free refined vegetable cooking oil fortified with Vitamin A. Clear, healthy, and odorless for frying and stews.',
    imageUrl: GROCERIES_IMAGE,
    images: [
      GROCERIES_IMAGE,
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop'
    ],
    sellerId: 'user_seller_01',
    sellerName: 'Basirat Super Provisions & Foodstuffs',
    sellerRating: 4.8,
    sellerLocation: 'Allen Avenue, Ikeja',
    stockQuantity: 60,
    isAvailable: true,
    unit: '2 Litre Bottle',
    popular: true
  },
  {
    id: 'prod_groc_04',
    name: 'Fresh Red Scotch Bonnet Peppers & Farm Tomatoes Basket',
    category: 'Groceries & Foodstuffs',
    price: 14000,
    originalPrice: 15500,
    description: 'Fresh, fiery Nigerian red scotch bonnets (atarodo) and juicy Jos plum tomatoes hand-selected directly from Mile 12 Market.',
    imageUrl: FRESH_FOOD_IMAGE,
    images: [
      FRESH_FOOD_IMAGE,
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=800&auto=format&fit=crop'
    ],
    sellerId: 'user_seller_01',
    sellerName: 'Basirat Super Provisions & Foodstuffs',
    sellerRating: 4.8,
    sellerLocation: 'Mile 12 Market Depot',
    stockQuantity: 18,
    isAvailable: true,
    unit: 'Medium Basket'
  },
  {
    id: 'prod_chin_01',
    name: 'Selected Benue White Yam Tubers (Bundle of 5 Large)',
    category: 'Groceries & Foodstuffs',
    price: 18500,
    originalPrice: 21000,
    description: 'Dry, sweet, poundable Benue yams straight from the farm. Inspected for freshness, firmness, and excellent pounded yam texture. Fast courier pickup available.',
    imageUrl: FRESH_FOOD_IMAGE,
    images: [
      FRESH_FOOD_IMAGE,
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop'
    ],
    sellerId: 'user_merged_seller_helper_01',
    sellerName: 'Chinedu Foodstuff & Dispatch Express',
    sellerRating: 4.9,
    sellerLocation: '8 Opebi Road, Ikeja, Lagos',
    stockQuantity: 22,
    isAvailable: true,
    unit: 'Bundle of 5 Large Tubers',
    featured: true,
    popular: true
  },
  {
    id: 'prod_chin_02',
    name: 'Ijebu Crispy Garri Pure White (15kg Bag)',
    category: 'Groceries & Foodstuffs',
    price: 13500,
    originalPrice: 15000,
    description: 'Sour, crispy, stone-free Ijebu garri perfect for drinking with groundnut or making hot eba. Fast local courier pickup available.',
    imageUrl: GROCERIES_IMAGE,
    images: [
      GROCERIES_IMAGE,
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop'
    ],
    sellerId: 'user_merged_seller_helper_01',
    sellerName: 'Chinedu Foodstuff & Dispatch Express',
    sellerRating: 4.9,
    sellerLocation: '8 Opebi Road, Ikeja, Lagos',
    stockQuantity: 35,
    isAvailable: true,
    unit: '15kg Bag',
    popular: true
  },
  {
    id: 'prod_chin_03',
    name: 'Nsukka Pure Unadulterated Palm Oil (5 Litre Jerrycan)',
    category: 'Groceries & Foodstuffs',
    price: 12000,
    originalPrice: 13500,
    description: 'First-press red palm oil with rich aroma and deep red consistency, zero additives. Chinedu provides both in-store pickup and personal courier delivery.',
    imageUrl: GROCERIES_IMAGE,
    images: [
      GROCERIES_IMAGE,
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop'
    ],
    sellerId: 'user_merged_seller_helper_01',
    sellerName: 'Chinedu Foodstuff & Dispatch Express',
    sellerRating: 4.9,
    sellerLocation: '8 Opebi Road, Ikeja, Lagos',
    stockQuantity: 40,
    isAvailable: true,
    unit: '5L Jerrycan',
    featured: true
  }
];

export const MOCK_AVAILABLE_HELPERS: AvailableHelper[] = [
  {
    id: 'user_merged_seller_helper_01',
    name: 'Chinedu Okeke',
    phone: '+234 805 444 3322',
    rating: 4.85,
    completedJobsCount: 94,
    vehicleType: 'Motorcycle',
    serviceAreas: ['Opebi', 'Allen Avenue', 'Ikeja GRA', 'Maryland'],
    isAvailable: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    isSeller: true,
    sellerStoreName: 'Chinedu Foodstuff & Dispatch Express',
    sellerStoreAddress: '8 Opebi Road, Ikeja, Lagos',
    sellerStoreDescription: 'Wholesale grains, foodstuffs, and instant market shopping courier in Opebi and Ikeja.',
    sellerRating: 4.9,
    sellerCategory: 'Groceries & Provisions',
    kycTier: 'TIER_2_VERIFIED'
  },
  {
    id: 'user_helper_01',
    name: 'Babatunde "Tunde" Ojo',
    phone: '+234 814 987 6543',
    rating: 4.9,
    completedJobsCount: 218,
    vehicleType: 'Motorcycle',
    serviceAreas: ['Ikeja GRA', 'Allen Avenue', 'Maryland', 'Computer Village'],
    isAvailable: true,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    isSeller: false,
    kycTier: 'TIER_2_VERIFIED'
  },
  {
    id: 'helper_quickfix_01',
    name: 'Femi Balogun (QuickFix)',
    phone: '+234 802 888 4455',
    rating: 4.92,
    completedJobsCount: 88,
    vehicleType: 'Motorcycle',
    serviceAreas: ['Computer Village', 'Otigba St', 'Ikeja', 'Maryland'],
    isAvailable: true,
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    isSeller: true,
    sellerStoreName: 'QuickFix Auto & Tech Services',
    sellerStoreAddress: 'Computer Village, Otigba St, Ikeja',
    sellerStoreDescription: 'Certified technician repairs, solar installations, and express hardware pickups in Computer Village.',
    sellerRating: 4.9,
    sellerCategory: 'Services & Tech Repairs',
    kycTier: 'TIER_2_VERIFIED'
  },
  {
    id: 'helper_chukwuma_02',
    name: 'Chukwuma Obi',
    phone: '+234 803 999 1122',
    rating: 4.8,
    completedJobsCount: 142,
    vehicleType: 'Bicycle / Market Runner',
    serviceAreas: ['Ikeja GRA', 'Computer Village', 'Allen Avenue'],
    isAvailable: true,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    isSeller: false,
    kycTier: 'TIER_2_VERIFIED'
  },
  {
    id: 'helper_basirat_dispatch_01',
    name: 'Basirat Express Courier',
    phone: '+234 803 111 2233',
    rating: 4.8,
    completedJobsCount: 160,
    vehicleType: 'Delivery Van / Bike',
    serviceAreas: ['Allen Avenue', 'Ikeja Mall', 'Alausa', 'Oregun'],
    isAvailable: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    isSeller: true,
    sellerStoreName: 'Basirat Super Provisions & Foodstuffs',
    sellerStoreAddress: '14 Allen Avenue, Opposite Ikeja Mall, Lagos',
    sellerStoreDescription: 'Direct distributor of staple grains, oils, dairy, and household essentials in Ikeja.',
    sellerRating: 4.8,
    sellerCategory: 'Groceries & Foodstuffs',
    kycTier: 'TIER_1_BASIC'
  }
];

export const MOCK_SAVED_ADDRESSES: Address[] = [
  {
    id: 'addr_01',
    title: 'Home (Ikeja GRA)',
    fullAddress: 'Plot 12 Isaac John Street, Ikeja GRA',
    area: 'Ikeja GRA',
    city: 'Lagos',
    state: 'Lagos State',
    isDefault: true,
    contactPhone: '+234 802 345 6789',
    coordinates: { lat: 6.5912, lng: 3.3578 }
  },
  {
    id: 'addr_02',
    title: 'Office (Victoria Island)',
    fullAddress: 'Plot 167 Adeola Odeku Street, Victoria Island',
    area: 'Victoria Island',
    city: 'Lagos',
    state: 'Lagos State',
    isDefault: false,
    contactPhone: '+234 802 345 6789',
    coordinates: { lat: 6.4281, lng: 3.4219 }
  },
  {
    id: 'addr_03',
    title: 'Family Residence (Lekki)',
    fullAddress: 'Block 4, Admiralty Way, Lekki Phase 1',
    area: 'Lekki Phase 1',
    city: 'Lagos',
    state: 'Lagos State',
    isDefault: false,
    contactPhone: '+234 802 345 6789',
    coordinates: { lat: 6.4474, lng: 3.4734 }
  }
];

export const MOCK_SHOPPING_REQUESTS: ShoppingRequest[] = [
  {
    id: 'REQ-NG-84920',
    shopperId: 'user_shopper_01',
    shopperName: 'Micah Adeyemi',
    shopperPhone: '+234 802 345 6789',
    title: 'Weekend Grocery & Market Run',
    targetMarketArea: 'Mile 12 Market / Ikeja Depot',
    deliveryAddress: MOCK_SAVED_ADDRESSES[0],
    estimatedBudgetNaira: 42000,
    helperFeeNaira: 3500,
    status: 'SHOPPING', // Active in progress to demonstrate live tracking & helper checklist
    assignedHelperId: 'user_helper_01',
    assignedHelperName: 'Babatunde "Tunde" Ojo',
    assignedHelperPhone: '+234 814 987 6543',
    assignedHelperRating: 4.9,
    subAdminId: 'user_subadmin_01',
    createdAt: '2026-09-30T05:45:00Z',
    updatedAt: '2026-09-30T06:15:00Z',
    priority: 'HIGH',
    verificationCode: '4829',
    items: [
      {
        id: 'item_01',
        name: 'Mama Gold Rice',
        quantity: '10kg',
        preferredBrand: 'Mama Gold or Royal Stallion',
        estimatedPriceNaira: 14500,
        isPurchased: true,
        actualPriceNaira: 14200
      },
      {
        id: 'item_02',
        name: 'Brown Honey Beans (Oloyin)',
        quantity: '5kg',
        notes: 'Please check that it has no weevils',
        estimatedPriceNaira: 8500,
        isPurchased: true,
        actualPriceNaira: 8500
      },
      {
        id: 'item_03',
        name: 'King\'s Vegetable Oil',
        quantity: '2 Bottles',
        preferredBrand: 'King\'s or Devon King\'s',
        estimatedPriceNaira: 7200,
        isPurchased: false
      },
      {
        id: 'item_04',
        name: 'Fresh Red Peppers (Atarodo)',
        quantity: '1 Medium basket',
        notes: 'Clean and firm',
        estimatedPriceNaira: 12000,
        isPurchased: false
      },
      {
        id: 'item_05',
        name: 'Egg Crate',
        quantity: '1 Crate (30 pieces)',
        preferredBrand: 'Large farm fresh',
        estimatedPriceNaira: 4800,
        isPurchased: false
      }
    ]
  },
  {
    id: 'REQ-NG-84925',
    shopperId: 'user_shopper_02',
    shopperName: 'Amina Bello',
    shopperPhone: '+234 803 445 9988',
    title: 'Household Cleaning & Beverages',
    targetMarketArea: 'Oyingbo Market / Yaba',
    deliveryAddress: {
      id: 'addr_amina',
      title: 'Home',
      fullAddress: '15 Commercial Avenue, Sabo Yaba, Lagos',
      area: 'Yaba',
      city: 'Lagos',
      state: 'Lagos State',
      isDefault: true,
      contactPhone: '+234 803 445 9988'
    },
    estimatedBudgetNaira: 28000,
    helperFeeNaira: 2800,
    status: 'PENDING_ASSIGNMENT',
    createdAt: '2026-09-30T06:10:00Z',
    updatedAt: '2026-09-30T06:10:00Z',
    priority: 'NORMAL',
    items: [
      { id: 'amina_01', name: 'Morning Fresh Dishwashing Liquid', quantity: '2 x 1000ml', estimatedPriceNaira: 4200 },
      { id: 'amina_02', name: 'Ariel Washing Powder', quantity: '2kg bag', estimatedPriceNaira: 6500 },
      { id: 'amina_03', name: 'Milo Refill Pack', quantity: '1kg pack', estimatedPriceNaira: 8000 },
      { id: 'amina_04', name: 'Dano Milk Powder', quantity: '800g pouch', estimatedPriceNaira: 7200 }
    ]
  },
  {
    id: 'REQ-NG-84918',
    shopperId: 'user_shopper_03',
    shopperName: 'Chidi Nwosu',
    shopperPhone: '+234 805 123 7890',
    title: 'Fresh Fish & Soup Condiments',
    targetMarketArea: 'Tejuosho Ultra Modern Market',
    deliveryAddress: {
      id: 'addr_chidi',
      title: 'Surulere Residence',
      fullAddress: '24 Adeniran Ogunsanya, Surulere, Lagos',
      area: 'Surulere',
      city: 'Lagos',
      state: 'Lagos State',
      isDefault: true,
      contactPhone: '+234 805 123 7890'
    },
    estimatedBudgetNaira: 34500,
    helperFeeNaira: 3200,
    status: 'ON_THE_WAY',
    assignedHelperId: 'user_helper_02',
    assignedHelperName: 'Emeka Sunday',
    assignedHelperPhone: '+234 812 555 6677',
    assignedHelperRating: 4.8,
    createdAt: '2026-09-30T04:20:00Z',
    updatedAt: '2026-09-30T06:05:00Z',
    priority: 'HIGH',
    verificationCode: '7103',
    items: [
      { id: 'chidi_01', name: 'Fresh Catfish (Cleaned)', quantity: '3 large pieces', estimatedPriceNaira: 16000, isPurchased: true },
      { id: 'chidi_02', name: 'Stockfish Head (Okporoko)', quantity: '2 pieces', estimatedPriceNaira: 11000, isPurchased: true },
      { id: 'chidi_03', name: 'Ugwu leaves & Waterleaves', quantity: '4 bundles', estimatedPriceNaira: 2500, isPurchased: true }
    ]
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-2026-9041',
    shopperId: 'user_shopper_01',
    shopperName: 'Micah Adeyemi',
    sellerId: 'user_seller_01',
    sellerName: 'Basirat Super Provisions',
    sellerStoreAddress: '14 Allen Avenue, Opposite Ikeja Mall, Lagos',
    items: [
      {
        productId: 'prod_01',
        productName: 'Mama Gold Superior Parboiled Rice',
        price: 25000,
        quantity: 1,
        unit: '25kg Bag',
        imageUrl: GROCERIES_IMAGE,
        sellerId: 'user_seller_01'
      },
      {
        productId: 'prod_03',
        productName: 'King\'s Pure Vegetable Cooking Oil',
        price: 7200,
        quantity: 1,
        unit: '2 Litre Bottle',
        imageUrl: GROCERIES_IMAGE,
        sellerId: 'user_seller_01'
      }
    ],
    subtotalNaira: 32200,
    deliveryFeeNaira: 2000,
    totalNaira: 34200,
    status: 'OUT_FOR_DELIVERY',
    paymentMethod: 'CARD_PAYSTACK',
    isPaid: true,
    deliveryAddress: MOCK_SAVED_ADDRESSES[0],
    createdAt: '2026-09-30T05:15:00Z',
    estimatedDeliveryTime: '25 mins',
    deliveryType: 'HELPER_PICKUP',
    pickupHelper: {
      id: 'user_merged_seller_helper_01',
      name: 'Chinedu Okeke',
      phone: '+234 805 444 3322',
      rating: 4.85,
      vehicleType: 'Motorcycle',
      isSeller: true,
      sellerStoreName: 'Chinedu Foodstuff & Dispatch Express',
      pickupCode: '8492',
      pickupStatus: 'OUT_FOR_DELIVERY',
      assignedAt: '2026-09-30T05:30:00Z'
    },
    helperAssigned: {
      id: 'user_merged_seller_helper_01',
      name: 'Chinedu Okeke',
      phone: '+234 805 444 3322',
      rating: 4.85
    }
  },
  {
    id: 'ORD-2026-8812',
    shopperId: 'user_shopper_01',
    shopperName: 'Micah Adeyemi',
    sellerId: 'user_seller_tech_01',
    sellerName: 'Slot Systems & Tech Village',
    sellerStoreAddress: 'Computer Village, Otigba St, Ikeja',
    items: [
      {
        productId: 'prod_gadget_03',
        productName: 'Apple AirPods Pro (2nd Gen, USB-C MagSafe)',
        price: 385000,
        quantity: 1,
        unit: 'Complete Pair in Box',
        imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop',
        sellerId: 'user_seller_tech_01'
      }
    ],
    subtotalNaira: 385000,
    deliveryFeeNaira: 2500,
    totalNaira: 387500,
    status: 'READY_FOR_PICKUP',
    paymentMethod: 'CARD_PAYSTACK',
    isPaid: true,
    deliveryAddress: MOCK_SAVED_ADDRESSES[0],
    createdAt: '2026-10-01T08:00:00Z',
    estimatedDeliveryTime: 'Ready at Store Counter',
    deliveryType: 'STANDARD_SHIPPING'
  },
  {
    id: 'ORD-2026-7734',
    shopperId: 'user_shopper_01',
    shopperName: 'Micah Adeyemi',
    sellerId: 'user_merged_seller_helper_01',
    sellerName: 'Chinedu Foodstuff & Dispatch Express',
    sellerStoreAddress: '8 Opebi Road, Ikeja, Lagos',
    items: [
      {
        productId: 'prod_chin_01',
        productName: 'Selected Benue White Yam Tubers (Bundle of 5 Large)',
        price: 18500,
        quantity: 1,
        unit: 'Bundle of 5 Large Tubers',
        imageUrl: FRESH_FOOD_IMAGE,
        sellerId: 'user_merged_seller_helper_01'
      }
    ],
    subtotalNaira: 18500,
    deliveryFeeNaira: 1500,
    totalNaira: 20000,
    status: 'CONFIRMED',
    paymentMethod: 'BANK_TRANSFER',
    isPaid: true,
    deliveryAddress: MOCK_SAVED_ADDRESSES[0],
    createdAt: '2026-10-01T14:30:00Z',
    estimatedDeliveryTime: '40 mins',
    deliveryType: 'HELPER_PICKUP',
    pickupHelper: {
      id: 'user_merged_seller_helper_01',
      name: 'Chinedu Okeke',
      phone: '+234 805 444 3322',
      rating: 4.85,
      vehicleType: 'Motorcycle',
      isSeller: true,
      sellerStoreName: 'Chinedu Foodstuff & Dispatch Express',
      pickupCode: '3109',
      pickupStatus: 'ITEMS_COLLECTED',
      assignedAt: '2026-10-01T14:35:00Z'
    }
  }
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_01',
    userId: 'user_shopper_01',
    title: 'Helper Tunde is Shopping',
    body: 'Your helper Babatunde has purchased 2 of 5 items from your shopping request.',
    type: 'SHOPPING_PROGRESS',
    timestamp: '10 mins ago',
    isRead: false,
    relatedId: 'REQ-NG-84920'
  },
  {
    id: 'notif_02',
    userId: 'user_shopper_01',
    title: 'Order ORD-2026-9041 Dispatched',
    body: 'Your order from Basirat Super Provisions is out for delivery to Ikeja GRA.',
    type: 'ORDER_UPDATE',
    timestamp: '45 mins ago',
    isRead: false,
    relatedId: 'ORD-2026-9041'
  },
  {
    id: 'notif_03',
    userId: 'user_shopper_01',
    title: 'Weekend Market Discounts Active',
    body: 'Save up to 15% on fresh produce and staple bags across Lagos markets this weekend.',
    type: 'ADMIN_ANNOUNCEMENT',
    timestamp: '3 hours ago',
    isRead: true
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-984210',
    userId: 'user_shopper_01',
    userName: 'Micah Adeyemi',
    userRole: 'SHOPPER',
    amountNaira: 34200,
    type: 'ORDER_PAYMENT',
    status: 'SUCCESS',
    description: 'Payment for Order ORD-2026-9041 (Paystack)',
    createdAt: '2026-09-30T05:15:00Z',
    reference: 'PSK_REF_8819284'
  },
  {
    id: 'TXN-984209',
    userId: 'user_helper_01',
    userName: 'Babatunde Ojo',
    userRole: 'SHOPPING_HELPER',
    amountNaira: 3200,
    type: 'HELPER_PAYOUT',
    status: 'SUCCESS',
    description: 'Helper shopping delivery fee payout (Surulere Run)',
    createdAt: '2026-09-29T18:40:00Z',
    reference: 'HLP_PAY_554102'
  },
  {
    id: 'TXN-984208',
    userId: 'user_seller_01',
    userName: 'Basirat Super Provisions',
    userRole: 'SELLER',
    amountNaira: 58000,
    type: 'ORDER_PAYMENT',
    status: 'SUCCESS',
    description: 'Direct settlement to Stanbic IBTC Account',
    createdAt: '2026-09-29T14:10:00Z',
    reference: 'STL_NG_22904'
  }
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_01',
    senderId: 'user_helper_01',
    senderName: 'Babatunde Ojo (Helper)',
    senderRole: 'SHOPPING_HELPER',
    receiverId: 'user_shopper_01',
    content: 'Hello Micah! Good morning. I am currently at the market for your grocery run.',
    timestamp: '06:05 AM',
    isRead: true,
    relatedRequestId: 'REQ-NG-84920'
  },
  {
    id: 'msg_02',
    senderId: 'user_shopper_01',
    senderName: 'Micah Adeyemi',
    senderRole: 'SHOPPER',
    receiverId: 'user_helper_01',
    content: 'Good morning Tunde! Thanks. Please ensure the honey beans are stone-free.',
    timestamp: '06:08 AM',
    isRead: true,
    relatedRequestId: 'REQ-NG-84920'
  },
  {
    id: 'msg_03',
    senderId: 'user_helper_01',
    senderName: 'Babatunde Ojo (Helper)',
    senderRole: 'SHOPPING_HELPER',
    receiverId: 'user_shopper_01',
    content: 'Yes sir, I checked the bag thoroughly and it is fresh Oloyin honey beans. Moving to the cooking oil now.',
    timestamp: '06:14 AM',
    isRead: false,
    relatedRequestId: 'REQ-NG-84920'
  }
];

export const MOCK_SELLER_HELPER_APPLICATIONS: SellerHelperApplication[] = [
  {
    id: 'app_01',
    sellerId: 'user_seller_02',
    sellerName: 'Musa Bello',
    storeName: 'Kano Grains & Dried Spices Depot',
    phone: '+234 803 999 1100',
    email: 'musa.grains@example.ng',
    locationArea: 'Mile 12 Market, Ketu, Lagos',
    vehicleType: 'Motorcycle',
    serviceAreas: ['Mile 12', 'Ketu', 'Ojota', 'Maryland'],
    ninOrIdNumber: 'NIN-8930192831',
    status: 'PENDING',
    appliedAt: '2026-09-28T14:30:00Z'
  },
  {
    id: 'app_02',
    sellerId: 'user_seller_03',
    sellerName: 'Mrs. Folake Balogun',
    storeName: 'Balogun Wholesale Dairy & Beverages',
    phone: '+234 802 777 5544',
    email: 'folake.dairy@example.ng',
    locationArea: 'Balogun Market, Lagos Island',
    vehicleType: 'Walking',
    serviceAreas: ['Balogun Market', 'CMS', 'Marina'],
    ninOrIdNumber: 'NIN-7718291042',
    status: 'PENDING',
    appliedAt: '2026-09-29T10:15:00Z'
  }
];
