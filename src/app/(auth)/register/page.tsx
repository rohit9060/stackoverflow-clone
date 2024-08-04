"use client";
import { useAuthStore } from "@/store";
import { useState } from "react";

export default function Page() {
  const { createAccount, login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!firstName || !lastName || !email || !password) {
      setIsError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setIsError("");
    const response = await createAccount(
      `${firstName} ${lastName}`,
      email,
      password
    );

    if (response.error) {
      setIsError(response.error!.message);
      setIsLoading(false);
      return;
    } else {
      const loginResponse = await login(email, password);
      if (loginResponse.error) {
        setIsError(loginResponse.error!.message);
        setIsLoading(false);
        return;
      }
    }
    setIsLoading(() => false);
  };

  return (
    <div>
      {isError && <div className="text-red-500">{isError}</div>}
      <form onSubmit={handleSubmit}></form>
    </div>
  );
}
