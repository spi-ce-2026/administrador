// app.config.js lê as variáveis do .env em tempo de build (Expo SDK 49+ carrega o .env aqui).
// Variáveis com prefixo EXPO_PUBLIC_ também são injetadas no bundle do app.

export default {
  expo: {
    plugins: [
      "@react-native-google-signin/google-signin",
      "expo-status-bar",
      "expo-font",
      [
        "expo-splash-screen",
        {
          image: "./assets/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
    ],
    name: "adminApp",
    slug: "adminApp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    scheme: "mentorias",
    ios: {
      supportsTablet: true,
    },
    android: {
      // Fornecido pelo professor depois que o pacote for registrado no projeto Firebase.
      googleServicesFile: "./google-services.json",
      package: "com.professorangoti.adminApp",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      // Lido pelo env.js do @mentorias/auth via Constants.expoConfig.extra.API_BASE_URL
      API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || "https://mentorias-api-gateway-10fcbc088ede.herokuapp.com/api/v1",
      ENV: process.env.ENV || "production",
      EXPO_PUBLIC_PROJECT_ID: process.env.EXPO_PUBLIC_PROJECT_ID || "",
    },
  },
};
