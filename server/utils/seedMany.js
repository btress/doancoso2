require('dotenv').config();
const connect = require('../config/database');
const Product = require('../models/Product');

const IMAGE_URL = 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop';

const products = [
  {
    name: 'iPhone 15 Pro Max',
    price: 1199,
    image: IMAGE_URL,
    storage: '256GB',
    color: 'Natural Titanium',
    description: 'Flagship titanium build with 5x telephoto.',
    features: ['A17 Pro', '5x Tele', 'USB-C'],
    category: 'iphone-15-series',
    modelType: 'pro-max',
    stock: 80,
    isFeatured: true,
    rating: 4.8,
    discount: 5,
    specifications: {
      display: '6.7"',
      processor: 'A17 Pro',
      camera: '48MP + 12MP + 12MP',
      battery: '29h video',
      weight: '221g'
    }
  },
  {
    name: 'iPhone 15 Pro',
    price: 999,
    image: IMAGE_URL,
    storage: '128GB',
    color: 'Blue Titanium',
    description: 'Pro performance in lighter body.',
    features: ['A17 Pro', 'USB-C', 'Action Button'],
    category: 'iphone-15-series',
    modelType: 'pro',
    stock: 100,
    isFeatured: true,
    rating: 4.7,
    discount: 0,
    specifications: {
      display: '6.1"',
      processor: 'A17 Pro',
      camera: '48MP + 12MP + 12MP',
      battery: '23h video',
      weight: '187g'
    }
  },
  {
    name: 'iPhone 15',
    price: 799,
    image: IMAGE_URL,
    storage: '128GB',
    color: 'Pink',
    description: 'Dynamic Island, 48MP camera.',
    features: ['A16', 'USB-C', 'Dynamic Island'],
    category: 'iphone-15-series',
    modelType: 'standard',
    stock: 120,
    isFeatured: false,
    rating: 4.6,
    discount: 0,
    specifications: {
      display: '6.1"',
      processor: 'A16',
      camera: '48MP + 12MP',
      battery: '20h video',
      weight: '171g'
    }
  },
  {
    name: 'iPhone 15 Plus',
    price: 899,
    image: IMAGE_URL,
    storage: '128GB',
    color: 'Green',
    description: 'Big battery, Dynamic Island.',
    features: ['A16', 'USB-C', 'Crash Detection'],
    category: 'iphone-15-series',
    modelType: 'standard',
    stock: 90,
    isFeatured: false,
    rating: 4.6,
    discount: 0,
    specifications: {
      display: '6.7"',
      processor: 'A16',
      camera: '48MP + 12MP',
      battery: '26h video',
      weight: '201g'
    }
  },
  {
    name: 'iPhone 14 Pro Max',
    price: 999,
    image: IMAGE_URL,
    storage: '256GB',
    color: 'Deep Purple',
    description: 'ProMotion and 48MP main.',
    features: ['A16', 'ProMotion', 'Dynamic Island'],
    category: 'iphone-14-series',
    modelType: 'pro-max',
    stock: 60,
    isFeatured: true,
    rating: 4.5,
    discount: 10,
    specifications: {
      display: '6.7"',
      processor: 'A16',
      camera: '48MP + 12MP + 12MP',
      battery: '29h video',
      weight: '240g'
    }
  },
  {
    name: 'iPhone 14 Pro',
    price: 899,
    image: IMAGE_URL,
    storage: '128GB',
    color: 'Space Black',
    description: 'Dynamic Island on compact Pro.',
    features: ['A16', 'ProMotion', 'Always-On'],
    category: 'iphone-14-series',
    modelType: 'pro',
    stock: 70,
    isFeatured: false,
    rating: 4.5,
    discount: 0,
    specifications: {
      display: '6.1"',
      processor: 'A16',
      camera: '48MP + 12MP + 12MP',
      battery: '23h video',
      weight: '206g'
    }
  },
  {
    name: 'iPhone 14',
    price: 699,
    image: IMAGE_URL,
    storage: '128GB',
    color: 'Midnight',
    description: 'Reliable A15 with good battery.',
    features: ['A15', 'Crash Detection', 'Ceramic Shield'],
    category: 'iphone-14-series',
    modelType: 'standard',
    stock: 110,
    isFeatured: false,
    rating: 4.4,
    discount: 0,
    specifications: {
      display: '6.1"',
      processor: 'A15',
      camera: '12MP + 12MP',
      battery: '20h video',
      weight: '172g'
    }
  },
  {
    name: 'iPhone 14 Plus',
    price: 799,
    image: IMAGE_URL,
    storage: '128GB',
    color: 'Starlight',
    description: 'Large screen with long battery.',
    features: ['A15', 'Crash Detection', 'Action mode'],
    category: 'iphone-14-series',
    modelType: 'standard',
    stock: 85,
    isFeatured: false,
    rating: 4.4,
    discount: 0,
    specifications: {
      display: '6.7"',
      processor: 'A15',
      camera: '12MP + 12MP',
      battery: '26h video',
      weight: '203g'
    }
  },
  {
    name: 'iPhone 13',
    price: 599,
    image: IMAGE_URL,
    storage: '128GB',
    color: 'Blue',
    description: 'Great value A15 Bionic.',
    features: ['A15', '5G', 'Cinematic mode'],
    category: 'iphone-13-series',
    modelType: 'standard',
    stock: 140,
    isFeatured: false,
    rating: 4.3,
    discount: 0,
    specifications: {
      display: '6.1"',
      processor: 'A15',
      camera: '12MP + 12MP',
      battery: '19h video',
      weight: '174g'
    }
  },
  {
    name: 'iPhone 13 mini',
    price: 549,
    image: IMAGE_URL,
    storage: '128GB',
    color: 'Red',
    description: 'Compact with flagship chip.',
    features: ['A15', '5G', 'MagSafe'],
    category: 'iphone-13-series',
    modelType: 'standard',
    stock: 60,
    isFeatured: false,
    rating: 4.2,
    discount: 0,
    specifications: {
      display: '5.4"',
      processor: 'A15',
      camera: '12MP + 12MP',
      battery: '17h video',
      weight: '141g'
    }
  }
];

(async () => {
  try {
    await connect();
    await Product.deleteMany({});
    const inserted = await Product.insertMany(products);
    console.log('Inserted products:', inserted.length);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

