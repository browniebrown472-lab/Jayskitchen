import { MenuItem, Category } from '../types';

export const RESTAURANT_INFO = {
  name: "Jay's Kitchen",
  tagline: 'Authentic Nigerian Taste, Right Here in Ghana.',
  description:
    'Enjoy delicious Nigerian meals prepared with the rich flavors, spices, and traditions you love. Delivered hot and fresh across Accra.',
  phoneDisplay: '0205758826',
  phoneRaw: '0205758826',
  whatsappNumber: '233205758826', // International format for wa.me
  currency: 'GH₵',
  currencyCode: 'GHS',
  location: 'Accra, Ghana',
  serviceAreas: [
    'East Legon',
    'Osu',
    'Cantonments',
    'Airport Residential',
    'Dzorwulu',
    'Spintex',
    'Madina',
    'Adenta',
    'Ridge',
    'Labone',
    'Tema',
    'Dansoman',
    'Achimota',
    'Legon Campus',
    'Other Accra Area',
  ],
  openingHours: [
    { days: 'Monday – Saturday', time: '10:00 AM – 9:00 PM' },
    { days: 'Sunday', time: '12:00 PM – 8:00 PM' },
  ],
  email: 'orders@jayskitchengh.com',
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'rice', name: 'Rice', display_order: 1 },
  { id: 'soups', name: 'Soups', display_order: 2 },
  { id: 'swallows', name: 'Swallows', display_order: 3 },
  { id: 'proteins', name: 'Proteins', display_order: 4 },
  { id: 'snacks', name: 'Snacks', display_order: 5 },
  { id: 'sides', name: 'Sides', display_order: 6 },
  { id: 'drinks', name: 'Drinks', display_order: 7 },
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'jollof-rice',
    name: 'Jollof Rice',
    description:
      'Rich, smoky Nigerian-style jollof rice cooked with carefully selected aromatic peppers, bay leaves, and spices. Served with sweet fried plantains (dodo) and your choice of protein.',
    price: 45,
    category: 'Rice',
    image_url: '/src/assets/images/hero_nigerian_feast_1791373699915.jpg',
    available: true,
    featured: true,
    display_order: 1,
  },
  {
    id: 'fried-rice',
    name: 'Nigerian Fried Rice',
    description:
      'Flavorful Nigerian-style party fried rice packed with finely diced vegetables, sweet corn, green peas, seasoning, and delicious tender protein.',
    price: 50,
    category: 'Rice',
    image_url: '/src/assets/images/dish_fried_rice_1791373723960.jpg',
    available: true,
    featured: true,
    display_order: 2,
  },
  {
    id: 'egusi-soup',
    name: 'Egusi Soup & Pounded Yam',
    description:
      'Classic Nigerian egusi soup prepared with slow-toasted ground melon seeds, pumpkin leaves, crayfish, and assorted meats. Served with smooth pounded yam.',
    price: 55,
    category: 'Soups',
    image_url: '/src/assets/images/dish_egusi_soup_1791373712431.jpg',
    available: true,
    featured: true,
    display_order: 3,
  },
  {
    id: 'pepper-soup',
    name: 'Aromatic Pepper Soup',
    description:
      'Hot, aromatic Nigerian pepper soup prepared with traditional calabash spices, uda, scent leaves, and tender goat meat or fresh catfish.',
    price: 50,
    category: 'Soups',
    image_url: '/src/assets/images/dish_pepper_soup_1791373741040.jpg',
    available: true,
    featured: true,
    display_order: 4,
  },
  {
    id: 'vegetable-soup',
    name: 'Nigerian Vegetable Soup (Edikang Ikong Style)',
    description:
      'A rich Nigerian vegetable soup prepared with fresh leafy greens, waterleaves, traditional spices, stockfish, and authentic Nigerian assorted meat flavors.',
    price: 55,
    category: 'Soups',
    image_url: '/src/assets/images/dish_egusi_soup_1791373712431.jpg',
    available: true,
    featured: true,
    display_order: 5,
  },
  {
    id: 'pounded-yam-soup',
    name: 'Pounded Yam & Choice of Soup',
    description:
      'Smooth, stretchy traditional pounded yam served with your choice of rich Nigerian soup (Egusi, Ogbono, or Vegetable) and tender assorted protein.',
    price: 60,
    category: 'Swallows',
    image_url: '/src/assets/images/dish_egusi_soup_1791373712431.jpg',
    available: true,
    featured: true,
    display_order: 6,
  },
  {
    id: 'ofada-rice',
    name: 'Ofada Rice & Ayamase Sauce',
    description:
      'Traditional unpolished fragrant Ofada rice paired with spicy bleached palm oil green pepper designer stew (Ayamase) loaded with assorted boiled egg and meat.',
    price: 65,
    category: 'Rice',
    image_url: '/src/assets/images/hero_nigerian_feast_1791373699915.jpg',
    available: true,
    featured: false,
    display_order: 7,
  },
  {
    id: 'suya-beef',
    name: 'Spicy Beef Suya Platter',
    description:
      'Thinly sliced skewered beef grilled over open flame and generously rubbed with authentic northern Nigerian Yaji spice, served with fresh red onions and tomatoes.',
    price: 40,
    category: 'Proteins',
    image_url: '/src/assets/images/dish_fried_rice_1791373723960.jpg',
    available: true,
    featured: false,
    display_order: 8,
  },
  {
    id: 'moi-moi',
    name: 'Special Steamed Moi Moi',
    description:
      'Silky, savory steamed peeled honey bean pudding blended with red bell peppers, onions, flaked smoked fish, and boiled egg slices.',
    price: 25,
    category: 'Snacks',
    image_url: '/src/assets/images/hero_nigerian_feast_1791373699915.jpg',
    available: true,
    featured: false,
    display_order: 9,
  },
  {
    id: 'fried-plantains',
    name: 'Golden Fried Plantain (Dodo)',
    description:
      'Sweet, caramelized ripe plantains sliced and gently fried to golden brown perfection. The perfect Nigerian accompaniment to any rice or bean dish.',
    price: 20,
    category: 'Sides',
    image_url: '/src/assets/images/dish_fried_rice_1791373723960.jpg',
    available: true,
    featured: false,
    display_order: 10,
  },
  {
    id: 'grilled-chicken-peppered',
    name: 'Nigerian Peppered Grilled Chicken',
    description:
      'Tender grilled chicken pieces pan-tossed in a vibrant spicy habanero pepper and onion sauce.',
    price: 35,
    category: 'Proteins',
    image_url: '/src/assets/images/hero_nigerian_feast_1791373699915.jpg',
    available: true,
    featured: false,
    display_order: 11,
  },
  {
    id: 'zobo-drink',
    name: 'Chilled Spiced Zobo Drink',
    description:
      'Refreshing natural Nigerian hibiscus brew infused with fresh ginger, cloves, and pineapple essence. Served chilled.',
    price: 15,
    category: 'Drinks',
    image_url: '/src/assets/images/dish_pepper_soup_1791373741040.jpg',
    available: true,
    featured: false,
    display_order: 12,
  },
];
