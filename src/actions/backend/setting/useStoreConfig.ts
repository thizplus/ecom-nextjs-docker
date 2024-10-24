
import { useQuery } from "@tanstack/react-query";

import type { StoreConfig } from "@/types/storeConfigTypes";

const useStoreConfig = () => {

  return useQuery({
    queryKey: ['StoreConfig'],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/store/config`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json() as Promise<StoreConfig>;
    }
  });

};


export default useStoreConfig;
