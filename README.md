# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Reservation email setup

Reservations now trigger a confirmation email from the Supabase edge function.

Set these environment variables in your Supabase project for the edge function:

- GMAIL_USER
- GMAIL_APP_PASSWORD
- GMAIL_ADMIN_EMAIL (optional)

Use a Gmail account with an app password. The email is sent to the customer and optionally to the admin address when configured.

Notes:
- `GMAIL_ADMIN_EMAIL` can contain one or more recipients separated by commas, semicolons, or spaces.
- If `GMAIL_ADMIN_EMAIL` is not set, reservation admin notifications fall back to `GMAIL_FROM_ADDRESS` (or `GMAIL_USER`).

## Admin account bootstrap

You can create an admin account with the bootstrap edge function.

1. Set a secret in Supabase Edge Functions secrets:
   - BOOTSTRAP_ADMIN_SECRET
2. Deploy the function:
   - `supabase functions deploy bootstrap-admin`
3. Call it with a POST request to:
   - `https://<project-ref>.supabase.co/functions/v1/bootstrap-admin`
4. Payload:
   - `{ "email": "admin@example.com", "password": "StrongPassword123!", "admin_secret": "your-secret" }`

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
