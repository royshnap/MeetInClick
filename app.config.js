module.exports = ({ config }) => ({
    ...config,
    slug: "meetinclick",  // Ensure this matches the EAS project slug
    android: {
      //package: "com.royshnap.meetinclick" 
      package: "com.YandR.MeetInClick" 
    },
    ios: {
        //bundleIdentifier: "com.royshnap.meetinclick" 
        bundleIdentifier: "com.YandR.MeetInClick" 
      },
    extra: {
      ...config.extra,
      eas: {
        projectId: "c2efac3c-c482-4574-9987-5a8f7d523ca3"
      },
      clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
    }
  });
  