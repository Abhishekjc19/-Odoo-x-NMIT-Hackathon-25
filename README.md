# EcoSwap - A Sustainable Second-Hand Marketplace

![EcoSwap Hero Image](https://picsum.photos/seed/hero/1200/600)

EcoSwap is a modern, full-stack web application that provides a platform for users to buy, sell, and swap pre-loved goods. It's built with a focus on sustainability, community, and a seamless user experience, powered by Next.js and generative AI features.

## ✨ Key Features

- **User Authentication**: Secure sign-up and login functionality.
- **Product Listings**: Users can create, edit, and delete their product listings.
- **Advanced Search & Filtering**: Easily find products with text search and category filters.
- **AI-Powered Image Enhancement**: Automatically improve the quality of product photos upon upload.
- **AI-Powered Chatbot**: An intelligent assistant to help users find products and answer questions.
- **Personalized Recommendations**: AI-driven suggestions for products based on user browsing history.
- **Shopping Cart**: A persistent shopping cart to manage items before checkout.
- **Fully Responsive**: A beautiful and functional UI that works on all devices, from mobile to desktop.

## 🛠️ Tech Stack

This project is built with a modern, production-ready tech stack:

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN/UI](https://ui.shadcn.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Generative AI**: [Google's Gemini via Genkit](https://firebase.google.com/docs/genkit)
- **Deployment**: [Vercel](https://vercel.com/) / [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) (version 18 or later) and npm installed on your machine.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repository-name.git
    cd your-repository-name
    ```

2.  **Install NPM packages:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of your project and add any necessary API keys (e.g., for Google AI).
    ```
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```

### Running the Application

To start the development server, run the following command:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser to see the application.

## ☁️ Deployment

This application is configured for easy deployment on [Vercel](https://vercel.com/) or [Firebase App Hosting](https://firebase.google.com/docs/app-hosting).

To deploy, simply push your code to your connected GitHub repository. The `apphosting.yaml` file contains the configuration for Firebase App Hosting. For Vercel, no extra configuration is needed.

---

Thank you for checking out EcoSwap!
