// Ye saara data abhi dummy/placeholder hai.
// Baad mein backend (Flask API) se fetch hoga — images bhi tab backend se upload hongi.

export const shopInfo = {
  name: "Your Hardware Store",
  logo: "https://placehold.co/180x60/1f2937/ffffff?text=HARDWARE+STORE",
  tagline: "Quality Hardware & Fittings for Every Need",
};

export const banners = [
  {
    id: 1,
    image: "https://placehold.co/1200x350/b45309/ffffff?text=New+Arrivals",
    title: "New Arrivals",
    subtitle: "Check out our latest modular fittings",
  },
  {
    id: 2,
    image: "https://placehold.co/1200x350/1f2937/ffffff?text=Season+Offer",
    title: "Season Offer",
    subtitle: "Up to 20% off on selected items",
  },
];

export const offers = [
  { id: 1, text: "Flat 10% off on orders above ₹2000" },
  { id: 2, text: "Free delivery on bulk orders" },
];

export const categories = [
  { id: "modular-fittings", name: "Modular Fittings" },
  { id: "hand-tools", name: "Hand Tools" },
  { id: "power-tools", name: "Power Tools" },
  { id: "electrical", name: "Electrical Items" },
  { id: "plumbing", name: "Plumbing" },
  { id: "paints", name: "Paints" },
];

export const products = [
  {
    id: 1,
    name: "Cabinet Hinge (Soft Close)",
    categoryId: "modular-fittings",
    brand: "Generic Brand",
    price: 120,
    unit: "1 piece",
    stock: 50,
    image: "https://placehold.co/300x300/d97706/ffffff?text=Cabinet+Hinge",
    description: "Durable soft-close cabinet hinge, easy to install.",
  },
  {
    id: 2,
    name: "Drawer Channel 18 inch",
    categoryId: "modular-fittings",
    brand: "Generic Brand",
    price: 350,
    unit: "1 pair",
    stock: 30,
    image: "https://placehold.co/300x300/d97706/ffffff?text=Drawer+Channel",
    description: "Smooth-sliding telescopic drawer channel.",
  },
  {
    id: 3,
    name: "Claw Hammer",
    categoryId: "hand-tools",
    brand: "Generic Brand",
    price: 250,
    unit: "1 piece",
    stock: 40,
    image: "https://placehold.co/300x300/374151/ffffff?text=Claw+Hammer",
    description: "Sturdy claw hammer with comfortable grip.",
  },
  {
    id: 4,
    name: "Cordless Drill Machine",
    categoryId: "power-tools",
    brand: "Generic Brand",
    price: 2200,
    unit: "1 piece",
    stock: 15,
    image: "https://placehold.co/300x300/374151/ffffff?text=Drill+Machine",
    description: "12V cordless drill with 2 batteries.",
  },
  {
    id: 5,
    name: "Modular Switch Board 6A",
    categoryId: "electrical",
    brand: "Generic Brand",
    price: 180,
    unit: "1 piece",
    stock: 60,
    image: "https://placehold.co/300x300/047857/ffffff?text=Switch+Board",
    description: "Modular electrical switch board, 6A rating.",
  },
  {
    id: 6,
    name: "PVC Pipe 1 inch (3 meter)",
    categoryId: "plumbing",
    brand: "Generic Brand",
    price: 150,
    unit: "1 piece",
    stock: 100,
    image: "https://placehold.co/300x300/1d4ed8/ffffff?text=PVC+Pipe",
    description: "Standard PVC pipe for plumbing use.",
  },
  
];
export const orders = [
  {
    id: "ORD1001",
    customerName: "Ramesh Kumar",
    phone: "9876543210",
    address: "123 MG Road, Bengaluru, 560001",
    items: [
      { name: "Cabinet Hinge (Soft Close)", quantity: 4, price: 120 },
      { name: "Claw Hammer", quantity: 1, price: 250 },
    ],
    total: 730,
    paymentStatus: "Paid",
    orderStatus: "Pending",
    date: "2026-07-10",
  },
  {
    id: "ORD1002",
    customerName: "Suresh Patel",
    phone: "9123456780",
    address: "45 Ring Road, Ahmedabad, 380001",
    items: [
      { name: "Cordless Drill Machine", quantity: 1, price: 2200 },
    ],
    total: 2200,
    paymentStatus: "Paid",
    orderStatus: "Shipped",
    date: "2026-07-09",
  },
  {
    id: "ORD1003",
    customerName: "Anita Sharma",
    phone: "9988776655",
    address: "78 Sector 21, Noida, 201301",
    items: [
      { name: "PVC Pipe 1 inch (3 meter)", quantity: 10, price: 150 },
      { name: "Modular Switch Board 6A", quantity: 3, price: 180 },
    ],
    total: 2040,
    paymentStatus: "Pending",
    orderStatus: "Pending",
    date: "2026-07-11",
  },
];