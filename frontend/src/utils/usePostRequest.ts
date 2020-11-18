import { useState, useCallback } from "react";

import { ServerResponse } from "./types";

const usePostRequest = () => {
  const [isLoading, setIsLoading] = useState(false);

  const makeRequest = useCallback(async (body: FormData) => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/form", {
        method: "POST",
        body,
      });

      if (!response.ok) {
        throw new Error(
          "An HTTP 4xx or 5xx error occurred while contacting the server!"
        );
      }

      return response.json() as Promise<ServerResponse>;
    } catch (error) {
      alert(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, makeRequest };
};

export default usePostRequest;
