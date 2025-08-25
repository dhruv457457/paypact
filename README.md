

# 💸 PayPact: Decentralized Group Payments on Solana

![PayPact Banner](https://i.ibb.co/kgTCHyG9/Chat-GPT-Image-Aug-16-2025-01-47-47-PM.png)


---

## ✨ About The Project

**PayPact** is a decentralized application that simplifies **group payments** using the **Solana blockchain**.
It allows organizers to create **pacts**, where participants can contribute via **Solana Pay QR codes**.
Payments are tracked **on-chain**, ensuring **transparency, security, and efficiency** in managing shared expenses.

---

## 🔑 Features

✅ **Instant Pact Creation** – Define a payment name, amount, and participants in seconds
<br/>
✅ **Seamless QR Payments** – Pay with Solana Pay-compatible wallets
<br/>
✅ **Automated On-Chain Tracking** – Secure, tamper-proof verification
<br/>
✅ **Frictionless Onboarding** – Social logins & Web3Auth integration
<br/>
✅ **Real-Time Organizer Dashboard** – Track who paid, who’s pending, and total collected
<br/>
✅ **Contact Management** – Save and reuse participant lists

---

## 🛠️ Tech Stack

* **Frontend:** React, TypeScript, Tailwind CSS
* **Blockchain:** Solana (`@solana/web3.js`, `@solana/spl-token`, `@solana/pay`)
* **Authentication:** Web3Auth (`@web3auth/modal`)
* **Database:** Firebase Firestore
* **Other:** `firebase`, `react-router-dom`

---

## 🚀 Getting Started

### ✅ Prerequisites

* Node.js & npm installed
* Firebase project with Firestore enabled
* Web3Auth project for authentication

### ⚡ Installation

```bash
# 1. Clone the repository
git clone https://github.com/your_username/your_project_name.git

# 2. Install dependencies
npm install

# 3. Set up environment variables in .env
VITE_WEB3AUTH_CLIENT_ID=YOUR_WEB3AUTH_CLIENT_ID
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
VITE_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID

# 4. Run the development server
npm run dev
```

---

## 🎮 Usage

* **Create a Pact** → Define name, amount, receiver wallet, due date, and participants
* **Manage Pacts** → View all your created/invited pacts
* **Make Payments** → Scan Solana Pay QR to contribute
* **Track Payments** → Monitor participant statuses in real-time
* **Manage Contacts** → Save & reuse contact lists

---

## 🤝 Contributing

Contributions make the community stronger 💪.
If you’d like to contribute:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---


