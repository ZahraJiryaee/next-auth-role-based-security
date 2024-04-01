// setup how you want ppl to authenticate with the app
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/app/(models)/User";
import bcrypt from "bcrypt";

export const options = {
  providers: [
    GitHubProvider({
      profile(profile) {
        console.log("Profile of GitHub:", profile);

        let userRole = "GitHub User";
        if (profile?.email == "zahrajiryaee77@gmail.com") {
          userRole = "admin";
        }

        return {
          ...profile,
          role: userRole,
        };
      },
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      profile(profile) {
        console.log("Profile of Google:", profile);

        let userRole = "Google User";

        return {
          ...profile,
          id: profile.sub,
          role: userRole,
        };
      },
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "text",
          placeholder: "your-email",
        },
        password: {
          label: "password",
          type: "password",
          placeholder: "your-password",
        },
      },
      async authorize(credentials) {
        try {
          const foundUser = await User.findOne({ email: credentials.email })
            .lean()
            .exec();

          if (foundUser) {
            const match = await bcrypt.compare(
              credentials.password,
              foundUser.password
            );

            if (match) {
              delete foundUser.password;

              foundUser["role"] = "Unverified Email";

              return foundUser;
            }
          }
        } catch (error) {
          console.log("credentials login error", error);
        }
        return null; // not-authenticated
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
      // add the role to the token so we can use it on the server side
    },
    async session({ session, token }) {
      if (session?.user) session.user.role = token.role;
      return session;
      // client ide usage
    },
  },
};
