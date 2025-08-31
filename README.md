-----

# 💸 PayPact: Decentralized Group Payments on Solana

![PayPact Banner](https://i.ibb.co/kgTCHyG9/Chat-GPT-Image-Aug-16-2025-01-47-47-PM.png)

**PayPact** is a decentralized application built on the **Solana blockchain** that simplifies, secures, and streamlines group payments. It empowers users to create shared payment "pacts," contribute via Solana Pay, and track all transactions on-chain for ultimate transparency and trust.

**[ 🔴 Live Demo ](https://your-live-demo-link.com) | [ 📄 Pitch Deck ](https://www.google.com/search?q=https://your-pitch-deck-link.com)**

-----

## The Problem

Managing shared expenses with friends, colleagues, or communities is often a messy process built on trust and manual tracking. Traditional payment apps are centralized, opaque, and can act as intermediaries, holding funds and controlling user data. In the Web3 space, coordinating group payments for things like NFT mints or DAO contributions still relies on sending funds to a single person's wallet, creating a single point of failure and a lack of transparency.

## The Solution: Trustless, On-Chain Pacts

PayPact solves this by moving the entire process onto the Solana blockchain.

  * **For Users:** It provides a simple, intuitive interface to create a payment pact, invite friends, and track contributions in real-time. No more chasing people for money or wondering who has paid.
  * **For Developers & Web3 Natives:** It offers a trustless, decentralized alternative. Payments are peer-to-peer, recorded immutably on-chain, and managed without a central authority. The "source of truth" is the public ledger, not a private database.

-----

## 🔑 Core Features

| Feature                    | Description                                                                                             |
| -------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Instant Pact Creation** | Define a pact name, amount, and participants in seconds.                                                |
| **Seamless QR Payments** | Participants contribute using any Solana Pay-compatible wallet via a simple QR code scan.               |
| **On-Chain Tracking** | Every payment is a Solana transaction, providing secure, tamper-proof, and publicly verifiable proof.   |
| **Frictionless Onboarding**| **Web3Auth** integration allows users to sign up with social accounts, creating a self-custodial wallet instantly. |
| **Real-Time Dashboard** | Organizers get a live view of who has paid, who is pending, and the total amount collected.             |
| **Contact Management** | Save and reuse participant lists for recurring groups, making pact creation even faster.                |

-----

## ⚙️ How It Works: The Technical Flow

PayPact uses a hybrid architecture that leverages the best of Web2 and Web3 for a seamless experience.

#### Flow 1: Creating a Pact

This flow shows how a simple UI action for the user is powered by a robust backend and blockchain interaction.

1.  **Authentication (Web3Auth):** A user logs in with a social account. Web3Auth generates a non-custodial Solana wallet for them behind the scenes.
2.  **Frontend (React):** The user defines the pact details (name, amount, participants).
3.  **Metadata Storage (Firebase):** The pact's metadata is stored off-chain in Firebase Firestore for efficient retrieval and state management.
4.  **URL Generation (Backend):** A backend service generates a unique Solana Pay URL, embedding the `pactId` into the transaction's memo field.
5.  **QR Code:** The frontend renders the URL as a scannable QR code for participants.

![Creating a Pact](https://i.ibb.co/QjpVBx8j/Gemini-Generated-Image-xbh8h5xbh8h5xbh8.png)

#### Flow 2: Paying a Pact

This flow demonstrates the "magic" of on-chain actions triggering real-time updates in the UI.

1.  **Scan & Approve (Solana Pay):** A participant scans the QR code with their wallet and approves the transaction.
2.  **On-Chain Confirmation (Solana):** The payment is confirmed on the Solana ledger. The transaction memo contains the `pactId`, linking it back to our app.
3.  **Backend Listener:** A dedicated backend service monitors the organizer's wallet address for incoming transactions with a valid `pactId` memo.
4.  **Status Update (Firebase):** Upon detecting a valid payment, the listener updates the participant's status from `PENDING` to `PAID` in Firestore.
5.  **Real-Time UI Update (React):** The organizer's dashboard, which has a live listener to Firestore, updates instantly to reflect the payment.

![Creating a Pact](https://i.ibb.co/nqPrGcF9/Gemini-Generated-Image-844g2t844g2t844g.png)

-----

## ✨ Spotlight: Web3Auth Integration

A core goal of PayPact is to make decentralized technology accessible to everyone, not just crypto natives. **Web3Auth is the key to achieving this.**

  * **Why Web3Auth?** We chose Web3Auth to eliminate the single greatest barrier to entry in Web3: complex wallet creation and seed phrase management. Traditional crypto onboarding is intimidating for new users.
  * **How it Works:**
    1.  A user clicks "Log in" and chooses their familiar Google, X, or other social account.
    2.  Web3Auth's SDK handles the cryptographic heavy lifting, generating a secure, non-custodial Solana wallet tied to their social identity.
    3.  The user is immediately onboarded with a real wallet and can start creating or paying pacts without ever needing to download a separate extension or worry about private keys.

This integration allows PayPact to feel as simple as a standard web app while providing the full security and self-custody benefits of a decentralized application.

-----

## 🛠️ Tech Stack

  * **Frontend:** React, TypeScript, Tailwind CSS
  * **Blockchain:** Solana (`@solana/web3.js`, `@solana/spl-token`, `@solana/pay`)
  * **Authentication:** Web3Auth (`@web3auth/modal`)
  * **Database:** Firebase Firestore
  * **Other:** `firebase`, `react-router-dom`

-----

## 🚀 Getting Started & Running the Demo

To get a local copy up and running, follow these simple steps.

### Prerequisites

  * Node.js & npm installed (`v18.x` or higher recommended)
  * A Firebase project with Firestore enabled.
  * A Web3Auth project to get a Client ID.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/dhruv457457/paypact.git
    cd paypact
    ```
2.  **Install NPM packages:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    Create a `.env` file in the root of your project and add the following variables. You will get these from your Firebase and Web3Auth project dashboards.
    ```env
    VITE_WEB3AUTH_CLIENT_ID=YOUR_WEB3AUTH_CLIENT_ID
    VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
    VITE_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
    VITE_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
    VITE_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
    VITE_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
    VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173) (or the port shown in your terminal) to view the application.

-----

## 🎮 Usage

  * **Create a Pact** → Define a name, amount, receiver wallet, and add participants.
  * **Manage Pacts** → View all pacts you have created or been invited to.
  * **Make Payments** → Scan the generated Solana Pay QR code to contribute.
  * **Track Payments** → Monitor participant statuses in real-time on your dashboard.
  * **Manage Contacts** → Save and reuse contact lists for easy pact creation.

-----

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

-----

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
