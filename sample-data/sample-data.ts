import { hashSync } from "bcrypt-ts-edge";

const sampleData = {
  users: [
    {
      name: "Harry-User",
      email: "user@example.com",
      password: hashSync("123456", 10),
      role: "user",
    },
    {
      name: "Harry-Admin",
      email: "admin@example.com",
      password: hashSync("123456", 10),
      role: "admin",
    },
  ],
  products: [
    {
      name: "Air Jordan 1 Mid",
      slug: "air-jordan-mid",
      category: "Men's Shoes",
      description:
        "Inspired by the original AJ1, this mid-top edition maintains the iconic look you love while choice colours and crisp leather give it a distinct identity.",
      images: [
        "/images/sample-products/a-one.jpeg",
        "/images/sample-products/a-two.jpeg",
      ],
      price: 195.99,
      brand: "Jordan",
      rating: 4.8,
      numReviews: 8,
      stock: 10,
      isFeatured: true,
      banner: "banner-one.png",
    },
    {
      name: "Air Jordan 1 Low",
      slug: "air-jordan-low",
      category: "Men's Shoes",
      description:
        "Inspired by the original AJ1, this mid-top edition maintains the iconic look you love while choice colours and crisp leather give it a distinct identity.",
      images: ["/images/sample-products/c-one.jpeg"],
      price: 190.99,
      brand: "Jordan",
      rating: 4.5,
      numReviews: 10,
      stock: 5,
      isFeatured: true,
      banner: "banner-one.png",
    },
    {
      name: "Air Jordan 1 High",
      slug: "air-jordan-high",
      category: "Men's Shoes",
      description:
        "Inspired by the original AJ1, this mid-top edition maintains the iconic look you love while choice colours and crisp leather give it a distinct identity.",
      images: [
        "/images/sample-products/b-one.jpeg",
        "/images/sample-products/b-two.jpeg",
      ],
      price: 150.99,
      brand: "Jordan",
      rating: 4.3,
      numReviews: 5,
      stock: 5,
      isFeatured: true,
      banner: "banner-one.png",
    },
  ],
};

export default sampleData;
