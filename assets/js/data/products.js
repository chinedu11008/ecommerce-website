/**
 * products.js
 * -----------------------------------------------------------------------
 * Placeholder product catalog. There's no backend/database, so this file
 * is the single source of truth that category pages, product pages,
 * search, cart, and the header dropdown/sidebar all read from.
 *
 * Categories: the landing page originally showcased 8 categories, but the
 * header's dropdown menu and the sidebar filter listed several more
 * (Footwear, Jewelry, Perfume, Cosmetics, Bags, Gadgets/electronics) that
 * didn't correspond to any real products. Footwear and Jewelry had real
 * stock photography sitting unused in assets/images/products, so they've
 * been added here as full categories. The rest (Perfume, Cosmetics, Bags,
 * phones/laptops/etc.) had no supporting photography at all — inventing
 * product photos for those would mean showing the wrong picture for the
 * wrong item, so those dropdown/sidebar links point at the closest real
 * category (mostly "Gadgets and accessories") instead. See index.html's
 * dropdown-panel and sidebar-menu-category-list for where that mapping
 * is applied.
 */

export const CATEGORIES = [
  { slug: 'dress-frock', name: 'Dress & frock', icon: './assets/images/icons/dress.svg' },
  { slug: 'winter-wear', name: 'Winter wear', icon: './assets/images/icons/coat.svg' },
  { slug: 'glasses-lens', name: 'Glasses & lens', icon: './assets/images/icons/glasses.svg' },
  { slug: 'shorts-jeans', name: 'Shorts & jeans', icon: './assets/images/icons/shorts.svg' },
  { slug: 't-shirts', name: 'T-shirts', icon: './assets/images/icons/tee.svg' },
  { slug: 'jacket', name: 'Jacket', icon: './assets/images/icons/jacket.svg' },
  { slug: 'gadgets-accessories', name: 'Gadgets and accessories', icon: './assets/images/icons/watch.svg' },
  { slug: 'hat-caps', name: 'Hat & caps', icon: './assets/images/icons/hat.svg' },
  { slug: 'footwear', name: 'Footwear', icon: './assets/images/icons/shoes.svg' },
  { slug: 'jewelry', name: 'Jewelry', icon: './assets/images/icons/jewelry.svg' },
];

const IMG = (name) => `./assets/images/products/${name}`;

/** @typedef {{id:string, category:string, title:string, price:number, oldPrice?:number, img:string, imgHover?:string, rating:number, badge?:string, description:string}} Product */

/** @type {Product[]} */
export const PRODUCTS = [
  // Dress & frock
  { id: 'df-01', category: 'dress-frock', title: 'Floral Wrap Midi Dress', price: 52, oldPrice: 68, img: IMG('clothes-1.jpg'), imgHover: IMG('clothes-2.jpg'), rating: 4, badge: 'new', description: 'A lightweight wrap dress in a floral print, cut to a flattering midi length with a tie waist.' },
  { id: 'df-02', category: 'dress-frock', title: 'Pink Embroidered Top Frock', price: 46, img: IMG('clothes-2.jpg'), imgHover: IMG('clothes-1.jpg'), rating: 4, description: 'Soft cotton-blend frock with hand-finished embroidery across the neckline.' },
  { id: 'df-03', category: 'dress-frock', title: 'Black Floral Wrap Midi Skirt', price: 39, oldPrice: 49, img: IMG('clothes-3.jpg'), imgHover: IMG('clothes-4.jpg'), rating: 5, badge: '20%', description: 'A flowing midi skirt with a subtle floral print, easy to dress up or down.' },
  { id: 'df-04', category: 'dress-frock', title: 'Everyday Cotton Sundress', price: 33, img: IMG('clothes-4.jpg'), imgHover: IMG('clothes-3.jpg'), rating: 3, description: 'Breathable cotton sundress built for warm-weather days and easy care.' },
  { id: 'df-05', category: 'dress-frock', title: 'Evening Party Gown', price: 74, oldPrice: 95, img: IMG('party-wear-1.jpg'), imgHover: IMG('party-wear-2.jpg'), rating: 5, badge: 'sale', description: 'A floor-length gown with a fitted bodice, made for evening occasions.' },
  { id: 'df-06', category: 'dress-frock', title: 'Sequin Party Frock', price: 61, img: IMG('party-wear-2.jpg'), imgHover: IMG('party-wear-1.jpg'), rating: 4, description: 'All-over sequin frock that catches the light for parties and celebrations.' },

  // Winter wear
  { id: 'ww-01', category: 'winter-wear', title: "Men's Wool Blend Coat", price: 89, oldPrice: 110, img: IMG('jacket-1.jpg'), imgHover: IMG('jacket-2.jpg'), rating: 4, badge: 'sale', description: 'A tailored wool-blend overcoat built to layer over knitwear on cold days.' },
  { id: 'ww-02', category: 'winter-wear', title: 'Quilted Puffer Vest', price: 54, img: IMG('jacket-2.jpg'), imgHover: IMG('jacket-1.jpg'), rating: 4, description: 'Lightweight quilted vest with a warm fill, easy to layer under a coat.' },
  { id: 'ww-03', category: 'winter-wear', title: 'Fleece Zip-Up Pullover', price: 41, img: IMG('jacket-5.jpg'), imgHover: IMG('jacket-6.jpg'), rating: 4, badge: 'new', description: 'Soft fleece pullover with a half-zip collar for quick layering.' },
  { id: 'ww-04', category: 'winter-wear', title: 'Insulated Winter Parka', price: 96, oldPrice: 130, img: IMG('jacket-6.jpg'), imgHover: IMG('jacket-5.jpg'), rating: 5, badge: '25%', description: 'A heavily insulated parka with a storm hood, built for the coldest months.' },
  { id: 'ww-05', category: 'winter-wear', title: 'Knit Wool Cardigan', price: 58, img: IMG('1.jpg'), imgHover: IMG('2.jpg'), rating: 3, description: 'Chunky knit cardigan in a wool blend, worn open or buttoned.' },
  { id: 'ww-06', category: 'winter-wear', title: 'Thermal Base Layer Set', price: 29, img: IMG('2.jpg'), imgHover: IMG('1.jpg'), rating: 4, description: 'A moisture-wicking thermal top and bottom set for layering under everything else.' },

  // Glasses & lens
  { id: 'gl-01', category: 'glasses-lens', title: 'Round Metal Sunglasses', price: 24, img: IMG('3.jpg'), imgHover: IMG('4.jpg'), rating: 4, badge: 'new', description: 'Slim round frames in brushed metal with UV-protective lenses.' },
  { id: 'gl-02', category: 'glasses-lens', title: 'Polarized Aviator Sunglasses', price: 31, oldPrice: 42, img: IMG('4.jpg'), imgHover: IMG('3.jpg'), rating: 5, badge: 'sale', description: 'Classic aviator shape with polarized lenses to cut glare.' },
  { id: 'gl-03', category: 'glasses-lens', title: 'Blue-Light Reading Glasses', price: 19, img: IMG('watch-4.jpg'), imgHover: IMG('3.jpg'), rating: 3, description: 'Lightweight frames with a blue-light filter for screen time.' },
  { id: 'gl-04', category: 'glasses-lens', title: 'Classic Acetate Frame Glasses', price: 27, img: IMG('3.jpg'), imgHover: IMG('4.jpg'), rating: 4, description: 'Everyday acetate frames in a versatile shape that suits most face shapes.' },
  { id: 'gl-05', category: 'glasses-lens', title: 'Gradient Lens Sunglasses', price: 22, oldPrice: 30, img: IMG('4.jpg'), imgHover: IMG('3.jpg'), rating: 4, badge: '25%', description: 'Gradient-tinted lenses that lighten toward the bottom for softer vision.' },
  { id: 'gl-06', category: 'glasses-lens', title: 'Sports Wraparound Sunglasses', price: 26, img: IMG('watch-4.jpg'), imgHover: IMG('4.jpg'), rating: 3, description: 'Wraparound frame built to stay put during workouts and runs.' },

  // Shorts & jeans
  { id: 'sj-01', category: 'shorts-jeans', title: 'Slim Fit Denim Jeans', price: 44, img: IMG('shorts-1.jpg'), imgHover: IMG('shorts-2.jpg'), rating: 4, badge: 'new', description: 'Stretch denim jeans cut slim through the leg for everyday wear.' },
  { id: 'sj-02', category: 'shorts-jeans', title: 'High-Waist Mom Jeans', price: 48, oldPrice: 60, img: IMG('shorts-2.jpg'), imgHover: IMG('shorts-1.jpg'), rating: 5, badge: 'sale', description: 'Relaxed high-waist jeans with a vintage-inspired straight leg.' },
  { id: 'sj-03', category: 'shorts-jeans', title: 'Cotton Chino Shorts', price: 28, img: IMG('sports-1.jpg'), imgHover: IMG('sports-2.jpg'), rating: 3, description: 'Mid-length chino shorts in brushed cotton twill.' },
  { id: 'sj-04', category: 'shorts-jeans', title: 'Cargo Utility Shorts', price: 32, img: IMG('sports-2.jpg'), imgHover: IMG('sports-1.jpg'), rating: 4, description: 'Utility shorts with side cargo pockets and an adjustable waist.' },
  { id: 'sj-05', category: 'shorts-jeans', title: 'Distressed Skinny Jeans', price: 46, oldPrice: 55, img: IMG('sports-3.jpg'), imgHover: IMG('shorts-1.jpg'), rating: 4, badge: '15%', description: 'Skinny-fit jeans with light distressing at the knee.' },
  { id: 'sj-06', category: 'shorts-jeans', title: 'Athletic Running Shorts', price: 21, img: IMG('clothes-3.jpg'), imgHover: IMG('sports-2.jpg'), rating: 4, description: 'Lightweight running shorts with a built-in liner and side pockets.' },

  // T-shirts
  { id: 'ts-01', category: 't-shirts', title: 'Relaxed Short Sleeve T-Shirt', price: 18, img: IMG('shirt-1.jpg'), imgHover: IMG('shirt-2.jpg'), rating: 4, description: 'A relaxed-fit tee in soft combed cotton.' },
  { id: 'ts-02', category: 't-shirts', title: 'Pure Garment Dyed Cotton Shirt', price: 45, oldPrice: 56, img: IMG('shirt-2.jpg'), imgHover: IMG('shirt-1.jpg'), rating: 4, badge: 'sale', description: 'Garment-dyed button-up shirt with a slightly worn-in look.' },
  { id: 'ts-03', category: 't-shirts', title: 'Graphic Print Tee', price: 22, img: IMG('sports-4.jpg'), imgHover: IMG('sports-5.jpg'), rating: 3, badge: 'new', description: 'Cotton tee with an original graphic print across the chest.' },
  { id: 'ts-04', category: 't-shirts', title: 'Classic Crew Neck Tee', price: 16, img: IMG('sports-5.jpg'), imgHover: IMG('sports-4.jpg'), rating: 4, description: 'A no-frills crew neck tee built as a wardrobe staple.' },
  { id: 'ts-05', category: 't-shirts', title: 'Striped Long Sleeve Tee', price: 24, oldPrice: 31, img: IMG('sports-6.jpg'), imgHover: IMG('shirt-1.jpg'), rating: 3, badge: '20%', description: 'Long sleeve tee in a classic stripe, midweight cotton jersey.' },
  { id: 'ts-06', category: 't-shirts', title: "Girls' Embroidered Top", price: 20, img: IMG('clothes-1.jpg'), imgHover: IMG('shirt-2.jpg'), rating: 5, description: 'Soft cotton top with embroidered detailing at the collar.' },

  // Jacket
  { id: 'jk-01', category: 'jacket', title: "Men's Winter Leather Jacket", price: 48, oldPrice: 75, img: IMG('jacket-3.jpg'), imgHover: IMG('jacket-4.jpg'), rating: 4, badge: '15%', description: 'Faux-leather jacket with a quilted lining for cold-weather wear.' },
  { id: 'jk-02', category: 'jacket', title: "Men's Yarn Fleece Full-Zip Jacket", price: 58, oldPrice: 65, img: IMG('jacket-5.jpg'), imgHover: IMG('jacket-6.jpg'), rating: 4, description: 'Full-zip fleece jacket with a stand collar and side pockets.' },
  { id: 'jk-03', category: 'jacket', title: 'Windbreaker Track Jacket', price: 39, img: IMG('jacket-1.jpg'), imgHover: IMG('jacket-3.jpg'), rating: 3, badge: 'new', description: 'Lightweight windbreaker with a packable hood.' },
  { id: 'jk-04', category: 'jacket', title: 'Denim Trucker Jacket', price: 51, img: IMG('jacket-2.jpg'), imgHover: IMG('jacket-4.jpg'), rating: 4, description: 'Classic trucker jacket in mid-wash denim.' },
  { id: 'jk-05', category: 'jacket', title: 'Bomber Jacket', price: 63, oldPrice: 80, img: IMG('jacket-4.jpg'), imgHover: IMG('jacket-6.jpg'), rating: 5, badge: 'sale', description: 'Ribbed-hem bomber jacket with a lightweight fill.' },
  { id: 'jk-06', category: 'jacket', title: 'Lightweight Rain Jacket', price: 44, img: IMG('jacket-6.jpg'), imgHover: IMG('jacket-1.jpg'), rating: 4, description: 'Packable, water-resistant shell for unpredictable weather.' },

  // Gadgets and accessories
  { id: 'ga-01', category: 'gadgets-accessories', title: 'Classic Analog Watch', price: 65, oldPrice: 80, img: IMG('watch-1.jpg'), imgHover: IMG('watch-2.jpg'), rating: 5, badge: 'sale', description: 'A stainless steel analog watch with a classic dial.' },
  { id: 'ga-02', category: 'gadgets-accessories', title: 'Minimalist Steel Watch', price: 72, img: IMG('watch-2.jpg'), imgHover: IMG('watch-1.jpg'), rating: 4, description: 'Slim minimalist watch with a brushed steel case.' },
  { id: 'ga-03', category: 'gadgets-accessories', title: 'Smart Fitness Watch', price: 89, oldPrice: 110, img: IMG('watch-3.jpg'), imgHover: IMG('watch-4.jpg'), rating: 4, badge: '20%', description: 'Fitness tracking watch with heart-rate and step tracking.' },
  { id: 'ga-04', category: 'gadgets-accessories', title: 'Leather Dress Watch', price: 68, img: IMG('watch-4.jpg'), imgHover: IMG('watch-3.jpg'), rating: 4, badge: 'new', description: 'Dress watch on a genuine leather strap.' },
  { id: 'ga-05', category: 'gadgets-accessories', title: 'Genuine Leather Belt', price: 24, img: IMG('belt.jpg'), imgHover: IMG('belt.jpg'), rating: 3, description: 'Full-grain leather belt with a classic buckle.' },
  { id: 'ga-06', category: 'gadgets-accessories', title: 'Signature Eau de Parfum', price: 41, img: IMG('perfume.jpg'), imgHover: IMG('perfume.jpg'), rating: 4, description: 'A long-lasting eau de parfum in a signature scent.' },
  { id: 'ga-07', category: 'gadgets-accessories', title: 'Everyday Shampoo', price: 12, img: IMG('shampoo.jpg'), imgHover: IMG('shampoo.jpg'), rating: 4, description: 'A gentle, everyday shampoo for all hair types.' },
  { id: 'ga-08', category: 'gadgets-accessories', title: 'Canvas Shopping Tote', price: 19, img: IMG('belt.jpg'), imgHover: IMG('belt.jpg'), rating: 3, description: 'Durable canvas tote sized for everyday errands.' },

  // Hat & caps
  { id: 'hc-01', category: 'hat-caps', title: 'Classic Baseball Cap', price: 16, img: IMG('sports-1.jpg'), imgHover: IMG('sports-3.jpg'), rating: 4, badge: 'new', description: 'Adjustable cotton baseball cap with a curved brim.' },
  { id: 'hc-02', category: 'hat-caps', title: 'Wool Beanie', price: 14, img: IMG('sports-2.jpg'), imgHover: IMG('sports-4.jpg'), rating: 4, description: 'Ribbed wool beanie for cold-weather wear.' },
  { id: 'hc-03', category: 'hat-caps', title: 'Wide Brim Sun Hat', price: 21, oldPrice: 27, img: IMG('sports-3.jpg'), imgHover: IMG('sports-1.jpg'), rating: 3, badge: '20%', description: 'Wide-brim hat woven for sun coverage on hot days.' },
  { id: 'hc-04', category: 'hat-caps', title: 'Snapback Cap', price: 18, img: IMG('sports-4.jpg'), imgHover: IMG('sports-2.jpg'), rating: 4, description: 'Flat-brim snapback with an adjustable strap.' },
  { id: 'hc-05', category: 'hat-caps', title: 'Bucket Hat', price: 17, img: IMG('sports-5.jpg'), imgHover: IMG('sports-6.jpg'), rating: 5, badge: 'sale', description: 'Packable bucket hat in a lightweight cotton twill.' },
  { id: 'hc-06', category: 'hat-caps', title: 'Trucker Mesh Cap', price: 15, img: IMG('sports-6.jpg'), imgHover: IMG('sports-5.jpg'), rating: 3, description: 'Mesh-back trucker cap for breathability.' },

  // Footwear
  { id: 'fw-01', category: 'footwear', title: 'Running Sneakers', price: 58, oldPrice: 72, img: IMG('shoe-1.jpg'), imgHover: IMG('shoe-1_1.jpg'), rating: 4, badge: 'sale', description: 'Cushioned running sneakers with a breathable knit upper.' },
  { id: 'fw-02', category: 'footwear', title: 'Everyday Canvas Sneakers', price: 39, img: IMG('shoe-2.jpg'), imgHover: IMG('shoe-2_1.jpg'), rating: 4, description: 'Low-top canvas sneakers built for everyday wear.' },
  { id: 'fw-03', category: 'footwear', title: 'Formal Leather Oxfords', price: 74, oldPrice: 90, img: IMG('shoe-3.jpg'), imgHover: IMG('shoe-4.jpg'), rating: 5, badge: '18%', description: 'Polished leather oxfords for formal occasions.' },
  { id: 'fw-04', category: 'footwear', title: 'Casual Slip-On Loafers', price: 46, img: IMG('shoe-4.jpg'), imgHover: IMG('shoe-3.jpg'), rating: 4, description: 'Easy slip-on loafers for casual days.' },
  { id: 'fw-05', category: 'footwear', title: 'Safety Work Boots', price: 82, img: IMG('shoe-5.jpg'), imgHover: IMG('shoe-1.jpg'), rating: 4, badge: 'new', description: 'Reinforced work boots with a protective toe.' },
  { id: 'fw-06', category: 'footwear', title: 'Sports Training Shoes', price: 64, img: IMG('shoe-2.jpg'), imgHover: IMG('shoe-5.jpg'), rating: 4, description: 'Stable training shoes built for the gym.' },

  // Jewelry
  { id: 'jw-01', category: 'jewelry', title: 'Rose Gold Drop Earrings', price: 28, oldPrice: 36, img: IMG('jewellery-1.jpg'), imgHover: IMG('jewellery-2.jpg'), rating: 5, badge: 'sale', description: 'Delicate rose gold-plated drop earrings for everyday wear.' },
  { id: 'jw-02', category: 'jewelry', title: 'Couple Promise Rings (Pair)', price: 45, img: IMG('jewellery-2.jpg'), imgHover: IMG('jewellery-3.jpg'), rating: 4, badge: 'new', description: 'A matching pair of simple band rings for two.' },
  { id: 'jw-03', category: 'jewelry', title: 'Layered Chain Necklace', price: 33, oldPrice: 41, img: IMG('jewellery-3.jpg'), imgHover: IMG('jewellery-1.jpg'), rating: 4, badge: '20%', description: 'Layered chain necklace that pairs easily with everyday outfits.' },
  { id: 'jw-04', category: 'jewelry', title: 'Minimalist Stud Earrings', price: 19, img: IMG('jewellery-1.jpg'), imgHover: IMG('jewellery-3.jpg'), rating: 3, description: 'Small stud earrings for an everyday, understated look.' },
  { id: 'jw-05', category: 'jewelry', title: 'Beaded Charm Bracelet', price: 22, img: IMG('jewellery-2.jpg'), imgHover: IMG('jewellery-1.jpg'), rating: 4, description: 'Beaded bracelet with a single charm detail.' },
  { id: 'jw-06', category: 'jewelry', title: 'Pendant Necklace', price: 31, img: IMG('jewellery-3.jpg'), imgHover: IMG('jewellery-2.jpg'), rating: 5, description: 'Fine chain necklace with a single pendant.' },

  // Extracted from the original homepage sections (New Arrivals, Trending, Top Rated,
  // Deal of the day, New Products, sidebar best-sellers) so every existing product
  // card links to a real, working product page instead of "#".

  { id: 'ex-baby-fabric-shoes', category: 'footwear', title: 'baby fabric shoes', price: 4.0, oldPrice: 5.0, img: './assets/images/products/1.jpg', imgHover: './assets/images/products/2.jpg', rating: 5, description: 'A footwear favorite, baby fabric shoes, in classic everyday styling.' },
  { id: 'ex-men-s-hoodies-t-shirt', category: 'winter-wear', title: 'men\'s hoodies t-shirt', price: 7.0, oldPrice: 17.0, img: './assets/images/products/2.jpg', imgHover: './assets/images/products/3.jpg', rating: 4, description: 'men\'s hoodies t-shirt — a versatile pick from our winter wear collection.' },
  { id: 'ex-girls-t-shirt', category: 't-shirts', title: 'girls t-shirt', price: 3.0, oldPrice: 5.0, img: './assets/images/products/3.jpg', imgHover: './assets/images/products/4.jpg', rating: 4, description: 'Comfortable, everyday t-shirt: girls t-shirt.' },
  { id: 'ex-woolen-hat-for-men', category: 'hat-caps', title: 'woolen hat for men', price: 12.0, oldPrice: 15.0, img: './assets/images/products/4.jpg', imgHover: './assets/images/products/clothes-1.jpg', rating: 5, description: 'A well-reviewed headwear pick: woolen hat for men.' },
  { id: 'ex-relaxed-short-full-sleev', category: 't-shirts', title: 'Relaxed Short full Sleeve T-Shirt', price: 45.0, oldPrice: 12.0, img: './assets/images/products/clothes-1.jpg', imgHover: './assets/images/products/clothes-2.jpg', rating: 4, description: 'A t-shirt favorite, relaxed Short full Sleeve T-Shirt, in classic everyday styling.' },
  { id: 'ex-girls-pnk-embro-design-t', category: 'dress-frock', title: 'Girls pnk Embro design Top', price: 61.0, oldPrice: 9.0, img: './assets/images/products/clothes-2.jpg', imgHover: './assets/images/products/clothes-3.jpg', rating: 4, description: 'Girls pnk Embro design Top — a versatile pick from our dress & frock collection.' },
  { id: 'ex-black-floral-wrap-midi-s', category: 'dress-frock', title: 'Black Floral Wrap Midi Skirt', price: 76.0, oldPrice: 25.0, img: './assets/images/products/clothes-3.jpg', imgHover: './assets/images/products/shirt-1.jpg', rating: 4, description: 'Comfortable, everyday dress & frock: black Floral Wrap Midi Skirt.' },
  { id: 'ex-pure-garment-dyed-cotton', category: 't-shirts', title: 'Pure Garment Dyed Cotton Shirt', price: 68.0, oldPrice: 31.0, img: './assets/images/products/shirt-1.jpg', imgHover: './assets/images/products/jacket-5.jpg', rating: 4, description: 'A well-reviewed t-shirt pick: pure Garment Dyed Cotton Shirt.' },
  { id: 'ex-men-yarn-fleece-full-zip', category: 'winter-wear', title: 'MEN Yarn Fleece Full-Zip Jacket', price: 61.0, oldPrice: 11.0, img: './assets/images/products/jacket-5.jpg', imgHover: './assets/images/products/jacket-1.jpg', rating: 4, description: 'A winter wear favorite, mEN Yarn Fleece Full-Zip Jacket, in classic everyday styling.' },
  { id: 'ex-mens-winter-leathers-jac', category: 'jacket', title: 'Mens Winter Leathers Jackets', price: 48.0, oldPrice: 75.0, img: './assets/images/products/jacket-3.jpg', imgHover: './assets/images/products/jacket-4.jpg', rating: 3, description: 'Mens Winter Leathers Jackets — a versatile pick from our jacket collection.' },
  { id: 'ex-better-basics-french-ter', category: 'shorts-jeans', title: 'Better Basics French Terry Sweatshorts', price: 20.0, oldPrice: 10.0, img: './assets/images/products/shorts-1.jpg', imgHover: './assets/images/products/sports-1.jpg', rating: 4, description: 'Comfortable, everyday shorts & jeans: better Basics French Terry Sweatshorts.' },
  { id: 'ex-running-trekking-shoes-w', category: 'footwear', title: 'Running & Trekking Shoes - White', price: 49.0, oldPrice: 15.0, img: './assets/images/products/sports-1.jpg', imgHover: './assets/images/products/sports-2.jpg', rating: 4, description: 'A well-reviewed footwear pick: running & Trekking Shoes - White.' },
  { id: 'ex-trekking-running-shoes-b', category: 'footwear', title: 'Trekking & Running Shoes - black', price: 78.0, oldPrice: 36.0, img: './assets/images/products/sports-2.jpg', imgHover: './assets/images/products/party-wear-1.jpg', rating: 4, description: 'A footwear favorite, trekking & Running Shoes - black, in classic everyday styling.' },
  { id: 'ex-womens-party-wear-shoes', category: 'dress-frock', title: 'Womens Party Wear Shoes', price: 94.0, oldPrice: 42.0, img: './assets/images/products/party-wear-1.jpg', imgHover: './assets/images/products/sports-3.jpg', rating: 4, description: 'Womens Party Wear Shoes — a versatile pick from our dress & frock collection.' },
  { id: 'ex-sports-claw-women-s-shoe', category: 'footwear', title: 'Sports Claw Women\'s Shoes', price: 54.0, oldPrice: 65.0, img: './assets/images/products/sports-3.jpg', imgHover: './assets/images/products/sports-6.jpg', rating: 4, description: 'Comfortable, everyday footwear: sports Claw Women\'s Shoes.' },
  { id: 'ex-air-trekking-shoes-white', category: 'footwear', title: 'Air Trekking Shoes - white', price: 52.0, oldPrice: 55.0, img: './assets/images/products/sports-6.jpg', imgHover: './assets/images/products/shoe-3.jpg', rating: 4, description: 'A well-reviewed footwear pick: air Trekking Shoes - white.' },
  { id: 'ex-boot-with-suede-detail', category: 'footwear', title: 'Boot With Suede Detail', price: 20.0, oldPrice: 30.0, img: './assets/images/products/shoe-3.jpg', imgHover: './assets/images/products/shoe-1.jpg', rating: 4, description: 'A footwear favorite, boot With Suede Detail, in classic everyday styling.' },
  { id: 'ex-men-s-leather-formal-wea', category: 'footwear', title: 'Men\'s Leather Formal Wear shoes', price: 56.0, oldPrice: 78.0, img: './assets/images/products/shoe-1.jpg', imgHover: './assets/images/products/shoe-2.jpg', rating: 4, description: 'Men\'s Leather Formal Wear shoes — a versatile pick from our footwear collection.' },
  { id: 'ex-casual-men-s-brown-shoes', category: 'footwear', title: 'Casual Men\'s Brown shoes', price: 50.0, oldPrice: 55.0, img: './assets/images/products/shoe-2.jpg', imgHover: './assets/images/products/watch-3.jpg', rating: 4, description: 'Comfortable, everyday footwear: casual Men\'s Brown shoes.' },
  { id: 'ex-pocket-watch-leather-pou', category: 'gadgets-accessories', title: 'Pocket Watch Leather Pouch', price: 50.0, oldPrice: 34.0, img: './assets/images/products/watch-3.jpg', imgHover: './assets/images/products/jewellery-3.jpg', rating: 4, description: 'A well-reviewed accessories pick: pocket Watch Leather Pouch.' },
  { id: 'ex-silver-deer-heart-neckla', category: 'jewelry', title: 'Silver Deer Heart Necklace', price: 84.0, oldPrice: 30.0, img: './assets/images/products/jewellery-3.jpg', imgHover: './assets/images/products/perfume.jpg', rating: 4, description: 'A jewelry favorite, silver Deer Heart Necklace, in classic everyday styling.' },
  { id: 'ex-titan-100-ml-womens-perf', category: 'gadgets-accessories', title: 'Titan 100 Ml Womens Perfume', price: 42.0, oldPrice: 10.0, img: './assets/images/products/perfume.jpg', imgHover: './assets/images/products/belt.jpg', rating: 4, description: 'Titan 100 Ml Womens Perfume — a versatile pick from our accessories collection.' },
  { id: 'ex-men-s-leather-reversible', category: 'gadgets-accessories', title: 'Men\'s Leather Reversible Belt', price: 24.0, oldPrice: 10.0, img: './assets/images/products/belt.jpg', imgHover: './assets/images/products/jewellery-2.jpg', rating: 4, description: 'Comfortable, everyday accessories: men\'s Leather Reversible Belt.' },
  { id: 'ex-platinum-zircon-classic-', category: 'jewelry', title: 'platinum Zircon Classic Ring', price: 62.0, oldPrice: 65.0, img: './assets/images/products/jewellery-2.jpg', imgHover: './assets/images/products/watch-1.jpg', rating: 4, description: 'A well-reviewed jewelry pick: platinum Zircon Classic Ring.' },
  { id: 'ex-smart-watche-vital-plus', category: 'gadgets-accessories', title: 'Smart watche Vital Plus', price: 56.0, oldPrice: 78.0, img: './assets/images/products/watch-1.jpg', imgHover: './assets/images/products/shampoo.jpg', rating: 4, description: 'A accessories favorite, smart watche Vital Plus, in classic everyday styling.' },
  { id: 'ex-shampoo-conditioner-pack', category: 'gadgets-accessories', title: 'shampoo conditioner packs', price: 20.0, oldPrice: 30.0, img: './assets/images/products/shampoo.jpg', imgHover: './assets/images/products/jewellery-1.jpg', rating: 4, description: 'shampoo conditioner packs — a versatile pick from our accessories collection.' },
  { id: 'ex-rose-gold-peacock-earrin', category: 'jewelry', title: 'Rose Gold Peacock Earrings', price: 20.0, oldPrice: 30.0, img: './assets/images/products/jewellery-1.jpg', imgHover: './assets/images/products/shampoo.jpg', rating: 4, description: 'Comfortable, everyday jewelry: rose Gold Peacock Earrings.' },
  { id: 'ex-shampoo-conditioner-face', category: 'gadgets-accessories', title: 'shampoo, conditioner & facewash packs', price: 150.0, oldPrice: 200.0, img: './assets/images/products/shampoo.jpg', imgHover: './assets/images/products/shampoo.jpg', rating: 3, description: 'A well-reviewed accessories pick: shampoo, conditioner & facewash packs.' },
  { id: 'ex-rose-gold-diamonds-earring', category: 'jewelry', title: 'Rose Gold diamonds Earring', price: 1990.0, img: './assets/images/products/jewellery-1.jpg', imgHover: './assets/images/products/jewellery-1.jpg', rating: 3, description: 'A statement pair of rose gold diamond earrings, featured as our current deal of the day.' },
];

export function getCategory(slug) {
  return CATEGORIES.find((c) => c.slug === slug) || null;
}

export function getProductsByCategory(slug) {
  return PRODUCTS.filter((p) => p.category === slug);
}

export function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id) || null;
}

/** Simple case-insensitive search across product titles/descriptions and
 *  category names. Used by search.js. */
export function search(query) {
  const q = String(query).trim().toLowerCase();
  if (!q) return { products: [], categories: [] };

  const products = PRODUCTS.filter((p) =>
    p.title.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );
  const categories = CATEGORIES.filter((c) => c.name.toLowerCase().includes(q));

  return { products, categories };
}

/** Turn arbitrary text into a stable slug-like id (used as a fallback when a
 *  product card on the page isn't one of the catalog entries above). */
export function slugify(text) {
  return String(text).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
