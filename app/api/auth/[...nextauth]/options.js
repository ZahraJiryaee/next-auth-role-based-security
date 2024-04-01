// setup how you want ppl to authenticate with the app
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

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
