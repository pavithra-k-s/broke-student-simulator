import { StoreProduct } from '../types/gameplay';
import { rupeesToPaise } from '../utils/currency';

export const INITIAL_STORE_PRODUCTS: StoreProduct[] = [
  // FOOD & DRINKS
  {
    id: 'prod_iced_coffee',
    name: 'Vanilla Iced Latte',
    description: 'Chilled bougie caffeine with whipped cream. +50 Dopamine, -150 Wallet.',
    category: 'Food & Drinks',
    pricePaise: rupeesToPaise(150),
    emoji: '🧋',
  },
  {
    id: 'prod_maggi',
    name: 'Hostel Double Maggi',
    description: 'Two bricks of 2-minute noodles with secret masala pack. Essential sustenance.',
    category: 'Food & Drinks',
    pricePaise: rupeesToPaise(40),
    emoji: '🍜',
  },
  {
    id: 'prod_canteen_meal',
    name: 'Canteen Mini Thali',
    description: 'Rice, dal, sabji, and two rotis. Reliable fuel to power through afternoon lectures.',
    category: 'Food & Drinks',
    pricePaise: rupeesToPaise(80),
    emoji: '🍛',
  },
  {
    id: 'prod_juice',
    name: 'Fresh Mosambi Juice',
    description: 'Scurvy prevention in a glass. 100% natural, ice-cold refresher.',
    category: 'Food & Drinks',
    pricePaise: rupeesToPaise(50),
    emoji: '🥤',
  },
  {
    id: 'prod_samosa_chai',
    name: 'Tapri Samosa & Cutting Chai',
    description: 'Crispy potato pastry paired with piping hot spiced tea. The heartbeat of student life.',
    category: 'Food & Drinks',
    pricePaise: rupeesToPaise(30),
    emoji: '🥟',
  },

  // ENTERTAINMENT
  {
    id: 'prod_movie_ticket',
    name: 'Multiplex Movie Ticket',
    description: 'AC auditorium, recliner seat, and 2.5 hours of escaping assignments.',
    category: 'Entertainment',
    pricePaise: rupeesToPaise(250),
    emoji: '🎟️',
  },
  {
    id: 'prod_gaming_session',
    name: 'Gaming Café 1-Hour Pass',
    description: 'Mechanical keyboard, 144Hz monitor, and tactical FPS squad battles with the boys.',
    category: 'Entertainment',
    pricePaise: rupeesToPaise(100),
    emoji: '🎮',
  },
  {
    id: 'prod_cafe_hangout',
    name: 'Artisan Café Hangout',
    description: 'Lo-Fi beats, aesthetically pleasing fairy lights, and pretend studying.',
    category: 'Entertainment',
    pricePaise: rupeesToPaise(180),
    emoji: '🍰',
  },

  // COLLEGE ESSENTIALS
  {
    id: 'prod_notebook',
    name: 'Classmate 200-Page Spiral Book',
    description: 'Fresh paper destined to hold 3 pages of neat notes followed by 197 pages of doodles.',
    category: 'College Essentials',
    pricePaise: rupeesToPaise(60),
    emoji: '📓',
  },
  {
    id: 'prod_pen',
    name: 'Smooth Blue Gel Pen',
    description: 'Glides across the paper. Guard it with your life or a classmate will steal it.',
    category: 'College Essentials',
    pricePaise: rupeesToPaise(10),
    emoji: '🖊️',
  },
  {
    id: 'prod_lab_supplies',
    name: 'Lab Record Kit',
    description: 'Graph paper, carbon sheet, and dissection/drawing tools required for marks.',
    category: 'College Essentials',
    pricePaise: rupeesToPaise(120),
    emoji: '📐',
  },
  {
    id: 'prod_highlighters',
    name: 'Neon Highlighters (Pack of 3)',
    description: 'Turn your boring textbook into a glowing festival of neon pink, yellow, and green.',
    category: 'College Essentials',
    pricePaise: rupeesToPaise(50),
    emoji: '🖍️',
  },

  // TRANSPORT
  {
    id: 'prod_bus_fare',
    name: 'State City Bus Ticket',
    description: 'Crowded standing journey, fresh air by the window, and rock-bottom price.',
    category: 'Transport',
    pricePaise: rupeesToPaise(20),
    emoji: '🚌',
  },
  {
    id: 'prod_auto_ride',
    name: 'Fast Auto-Rickshaw Drop',
    description: 'Weaving through rush hour traffic like a race car. Gets you to campus in 8 minutes.',
    category: 'Transport',
    pricePaise: rupeesToPaise(120),
    emoji: '🛺',
  },

  // IMPULSE PURCHASES
  {
    id: 'prod_earphones',
    name: 'Wireless Bluetooth Earbuds',
    description: 'Bass-boosted music with flashing LED charging case. Maximum student flex.',
    category: 'Impulse Buys',
    pricePaise: rupeesToPaise(399),
    emoji: '🎧',
  },
  {
    id: 'prod_random_shopping',
    name: 'Midnight Flash-Sale Mystery Item',
    description: 'You ordered it at 2:30 AM because it had a countdown timer. You definitely did not need it.',
    category: 'Impulse Buys',
    pricePaise: rupeesToPaise(299),
    emoji: '📦',
  },
  {
    id: 'prod_sticker_pack',
    name: 'Retro Laptop Sticker Pack',
    description: '25 holographic programming, anime, and meme stickers for your laptop lid.',
    category: 'Impulse Buys',
    pricePaise: rupeesToPaise(49),
    emoji: '✨',
  },

  // FREE ALTERNATIVES
  {
    id: 'prod_campus_walk',
    name: 'Campus Sunset Walk',
    description: 'Strolling through the campus trees with cool evening breeze. 100% serene, ₹0 cost.',
    category: 'Free Alternatives',
    pricePaise: 0,
    emoji: '🌳',
  },
  {
    id: 'prod_kettle_coffee',
    name: 'Homemade Hostel Kettle Coffee',
    description: 'Instant powder, hot water from your trusty electric kettle. Cheap, effective fuel.',
    category: 'Free Alternatives',
    pricePaise: rupeesToPaise(15),
    emoji: '☕',
  },
  {
    id: 'prod_hostel_terrace',
    name: 'Hostel Terrace Guitar Jam',
    description: 'Singing out-of-tune acoustic songs under the stars with your roommates.',
    category: 'Free Alternatives',
    pricePaise: 0,
    emoji: '🎸',
  },
  {
    id: 'prod_library_water',
    name: 'AC Library Reading & Chilled Water',
    description: 'Free air conditioning, comfortable sofas, and all the day’s newspapers.',
    category: 'Free Alternatives',
    pricePaise: 0,
    emoji: '📖',
  },
];

