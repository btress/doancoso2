const Product = require('../models/Product');
const Order = require('../models/Order');
const Contact = require('../models/Contact');

const products = [
  {
    name: 'iPhone 15 Pro Max',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop',
    storage: '256GB',
    color: 'Natural Titanium',
    description: 'The iPhone 15 Pro Max features the powerful A17 Pro chip, a titanium design, and the advanced Pro camera system with 5x Telephoto zoom.',
    features: [
      'A17 Pro chip with 6-core GPU',
      'Titanium design',
      'Pro camera system with 5x Telephoto',
      'Action Button',
      'USB-C connector'
    ],
    category: 'iphone-15-series',
    modelType: 'pro-max',
    stock: 50,
    isFeatured: true,
    rating: 4.8,
    discount: 0,
    specifications: {
      display: '6.7-inch Super Retina XDR display',
      processor: 'A17 Pro chip',
      camera: '48MP Main + 12MP Ultra Wide + 12MP 5x Telephoto',
      battery: 'Up to 29 hours video playback',
      weight: '221 grams'
    }
  },
  // Add more products...
];

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Contact.deleteMany({});

    // Insert products
    await Product.insertMany(products);

    console.log('✅ Database seeded successfully');
    console.log(`📊 ${products.length} products inserted`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

module.exports = seedDatabase;