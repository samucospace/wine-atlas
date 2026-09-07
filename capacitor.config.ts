import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.wineatlas.reference",
  appName: "Wine Atlas",
  webDir: "out",
  backgroundColor: "#24372e",
  android: {
    appendUserAgent: " WineAtlasAndroid/1.0",
  },
};

export default config;