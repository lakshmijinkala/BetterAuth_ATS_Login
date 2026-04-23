import "dotenv/config";
import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import Database from "better-sqlite3";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Expose any hidden initialization errors
const _auth = betterAuth({
  database: new Database("./db.sqlite"),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await resend.emails.send({
          from: process.env.EMAIL_FROM,
          to: email,
          subject: "Your ATS Sign-in Link",
          html: `
            <p>Click below to sign in to ATS:</p>
            <a href="${url}" style="
              display:inline-block;padding:12px 24px;
              background:#2F7AEC;color:white;
              text-decoration:none;border-radius:999px;
              font-family:sans-serif;
            ">Sign in to ATS</a>
            <p style="color:#6b7a8d;font-size:13px;">Expires in 10 minutes.</p>
          `,
        });
      },
      expiresIn: 600,
      disableSignUp: false,
    }),
  ],
});

export const auth = _auth;
