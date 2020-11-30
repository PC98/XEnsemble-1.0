import { useState, useCallback } from "react";

import { ServerResponse, UserInput } from "./types";

const usePostRequest = () => {
  const [isLoading, setIsLoading] = useState(false);

  const makeRequest = useCallback(async (body: UserInput) => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(
          "An HTTP 4xx or 5xx error occurred while contacting the server!"
        );
      }

      return response.json() as Promise<ServerResponse>;
    } catch (error) {
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, makeRequest };
};

export default usePostRequest;
