import NetInfo from "@react-native-community/netinfo";
import * as SecureStore from "expo-secure-store";

const useCache = async (
  key: string,
  apiFunc: any,
  CACHE_EXPIRE: number = 30 * 60 * 1000
) => {
  try {
    const state = await NetInfo.fetch();
    const cached = await SecureStore.getItemAsync(key);

    let parsed;
    if (cached) parsed = JSON.parse(cached);

    if (
      state.isConnected &&
      state.isInternetReachable &&
      (!parsed || Date.now() - parsed.timestamp > CACHE_EXPIRE)
    ) {
      const data = await apiFunc();

      await SecureStore.setItemAsync(
        key,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );

      return data;
    }

    if (parsed) return parsed.data;
  } catch (error) {
    console.log("Error fetching data:", error);
  }
};

export default useCache;
