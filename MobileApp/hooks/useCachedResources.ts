import * as Font from "expo-font";
import { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";


export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  //Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
      

        // Load fonts
        await Font.loadAsync({
          InterExtraBold: require("../assets/fonts/Inter-ExtraBold.ttf"),
          InterBold: require("../assets/fonts/Inter-Bold.ttf"),
          InterRegular: require("../assets/fonts/Inter-Regular.ttf"),
          ...FontAwesome.font,
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        alert(e);
      } finally {
        setLoadingComplete(true);
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
