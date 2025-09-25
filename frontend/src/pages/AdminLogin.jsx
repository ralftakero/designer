import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

function AdminLogin() {
  const [formData, setFormData] = useState({
    fullName: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const {
    mutate: loginMutation,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({ fullName, password }) => {
      try {
        const res = await fetch("/api/v1/rumman/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fullName, password }),
        });

        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }

        console.log(data);
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div className=" w-full h-screen flex items-center justify-center">
      <form
        className=" flex flex-col gap-3 drop-shadow-lg w-96"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          className="border border-zinc-400 w-full px-3 py-2 outline-none focus:outline-zinc-800 rounded-md"
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className="border border-zinc-400 w-full px-3 py-2 outline-none focus:outline-zinc-800 rounded-md"
          placeholder="Password"
        />
        <div className=" w-full flex items-center justify-between gap-2">
          <p className=" text-sm font-medium">Best of luck!</p>
          <button
            disabled={isPending}
            type="submit"
            className=" bg-zinc-900 text-white px-5 py-1.5 rounded-md w-max "
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminLogin;
