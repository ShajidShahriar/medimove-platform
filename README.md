# MediMove Int. - Medical Logistics Platform

**MediMove Int.** is a commercial-grade B2B digital platform designed to modernize the procurement of high-value medical equipment (Radiology, ICU, OT, etc.) for hospitals and clinics in Bangladesh.

Unlike standard e-commerce, this platform focuses on **Lead Generation** and **Quote Management** rather than direct checkout, mirroring the real-world complex sales cycle of medical logistics.

*(Note: Project currently uses local assets)*

##  Key Features (Client Side)

*   **Dynamic Product Catalog:** Filterable inventory of high-end medical equipment.
*   **Quote Cart System:** Users can build a list of equipment and request a formal price quote.
*   **Smart Search:** Real-time autocomplete search for rapid inventory lookup.
*   **Lead Capture:** Specialized forms for hospital consultations and urgent repair requests.
*   **Responsive UI:** Fully optimized for Desktop, Tablet, and Mobile.

##  Tech Stack

*   **Frontend:** React (Vite), TypeScript, Tailwind CSS, Framer Motion (Transitions).
*   **Backend:** Node.js, Express.js (REST API).
*   **Database:** MongoDB Atlas (NoSQL).
*   **State Management:** React Context API.
*   **Image Storage:** Cloudinary.

## Internal Tools (In Progress)

*   **Inventory CMS:** Internal dashboard for stock management.
*   **Lead CRM:** System for sales team to track incoming quotes.
*   *(Admin panel is currently restricted to authorized personnel)*

##  Local Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/shajidshahriar/medimove-platform.git
    cd medimove-platform
    ```

2.  **Setup Backend**
    ```bash
    cd server
    npm install
    # Create .env file with PORT, MONGO_URI, JWT_SECRET
    npm run dev
    ```

3.  **Setup Frontend**
    ```bash
    cd client
    npm install
    # Create .env file with VITE_API_URL, Cloudinary Credentials
    npm run dev
    ```

---
*© 2026 MediMove International. All rights reserved.*
