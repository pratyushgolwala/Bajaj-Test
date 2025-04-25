import { useState } from "react";
import { fetchDoctors } from "../lib/api/api.js";

export const useAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [doctors, setDoctors] = useState([]);

  const getDoctors = async () => {
    setIsLoading(true);
    try {
      const res = await fetchDoctors();
      setDoctors(res);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, getDoctors, error, doctors }
}