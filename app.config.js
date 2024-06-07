module.exports = ({ config }) => ({
    ...config,
    slug: "meetinclick",  // Ensure this matches the EAS project slug
    android: {
      package: "com.royshnap.meetinclick"  // Replace with your unique package identifier
    },
    extra: {
      ...config.extra,
      eas: {
        projectId: "c2efac3c-c482-4574-9987-5a8f7d523ca3"
      },
      clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
    }
  });
  