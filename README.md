# 🛒 E-Commerce Platform

A **backend e-commerce application** built with **Node.js, Express.js, MongoDB, and EJS**, featuring **user authentication, product management, order processing, and secure payments with Razorpay**.

## 🚀 Features

✅ **User Authentication:** Secure login with Passport.js (Local & Google OAuth2)  
✅ **Product Exploration:** Browse, search, and view product details  
✅ **Cart & Checkout:** Add products to cart and place orders  
✅ **Secure Payments:** Integrated **Razorpay** for seamless transactions  
✅ **Admin Panel:** Manage users, products, and orders efficiently  
✅ **Responsive UI:** Built with EJS for dynamic rendering  

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js  
- **Frontend:** EJS, Bootstrap  
- **Database:** MongoDB (Mongoose)  
- **Authentication:** Passport.js (Local & Google OAuth2)  
- **Payment Gateway:** Razorpay  

## 🔧 Installation

1️⃣ **Clone the repository**  
```bash
git clone https://github.com/rakeshkidecha/E-Commers/.git
cd E-Commers

2️⃣ Install dependencies
npm install

3️⃣ Set up environment variables
Create a .env file in the root directory and add:
MONGODB_CONNECT_URI = Your_Mongodb_uri
PORT = your_port
RAZORPAY_KEY_ID = Your_razorpay_id
RAZORPAY_SECRET_KEY = Your_razorpay_secret_key
GOOGLE_CLIENT_ID = your_google_client_id
GOOGLE_CLIENT_SECRET =  your_google_secret

4️⃣ Run the application
node index.js
