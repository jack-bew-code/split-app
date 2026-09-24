# Split Simple

A frictionless, no-login web application for splitting expenses among friends, roommates, or travel groups. 

Split Simple removes the barrier of user authentication. Instead of forcing users to create accounts to log a single shared expense, the app uses secure, unique URLs for group access and browser cookies to maintain a localized history of recently visited groups.

## Features

* **Zero-Friction Onboarding:** No accounts, passwords, or email verifications required.
* **Localized Dashboard:** Automatically tracks and displays recently created or visited groups using browser cookies.
* **Modern UI:** Built with Tailwind CSS and Shadcn components for a clean, responsive, and accessible interface.
* **Optimized Data Handling:** Utilizes Next.js Server Components and Server Actions for fast, secure database interactions without a traditional API layer.
* **Real-Time Feedback:** Integrated toast notifications for seamless user feedback on state changes.

## Tech Stack

* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS
* **UI Components:** Shadcn/UI 
* **Database:** PostgreSQL (via Neon Serverless)
* **Language:** TypeScript

## Getting Started

### Prerequisites
* Node.js 18+
* A PostgreSQL database (Neon, Vercel Postgres, or local)

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/yourusername/split-simple.git](https://github.com/yourusername/split-simple.git)
   cd split-simple
