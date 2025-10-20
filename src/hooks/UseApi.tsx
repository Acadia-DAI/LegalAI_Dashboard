import { useState } from "react";
import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "../../config";
import { toast } from "sonner";
import { useAuthStore } from "@/store/AuthStore";
// import { useAuthStore } from "../store/AuthStore";


export const useApi = <T = unknown>(defaultPath: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);
  // const storeToken = useAuthStore((state) => state.token);
  // const { getAccessToken } = useAccessToken();


  type Payload = Record<string, unknown>;
  type Params = Record<string, string | number | boolean>;

  const request = async (
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string = defaultPath,
    payload: Payload = {},
    params: Params = {}
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    // const token = await getAccessToken();
    try {
      const response = await axios<T>({
        method,
        url: `${API_BASE_URL}/${path}`,
        data: method !== "GET" ? payload : undefined,
        params: method === "GET" ? params : undefined,
        headers: {
          Authorization: `Bearer todoToken`, // Replace 'todoToken' with 'token' when implementing token retrieval
          ...(payload instanceof FormData ? {} : { "Content-Type": "application/json", "user-id": user?.displayName || user?.email || "" }),
        },
      });

      setData(response.data);
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ detail?: string }>;
      const message =
        axiosError.response?.data?.detail || axiosError.message || "Unknown API error";
      setError(message);
       toast.error("API Error", {
        description: "Internal server error. Please try again later.",
        duration: 10000
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 3. Specific method wrappers
  const fetchData = (params: Params = {}, overridePath?: string) =>
    request("GET", overridePath || defaultPath, {}, params);

  const postData = (payload: Payload = {}, overridePath?: string) =>
    request("POST", overridePath || defaultPath, payload);

  const putData = (payload: Payload = {}, overridePath?: string) =>
    request("PUT", overridePath || defaultPath, payload);

  const deleteData = (overridePath?: string) =>
    request("DELETE", overridePath || defaultPath);

  return { data, loading, error, fetchData, postData, putData, deleteData };
};
