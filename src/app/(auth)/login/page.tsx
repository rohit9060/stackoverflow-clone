"use client";

import { useAuthStore } from "@/store";
import { useState } from "react";

export default function Page() {
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setIsError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setIsError("");
    const response = await login(email, password);

    if (response.error) {
      setIsError(response.error!.message);
      setIsLoading(false);
      return;
    }
    setIsLoading(() => false);
  };

  return (
    <div>
      <h1>Login</h1>
    </div>
  );
}
