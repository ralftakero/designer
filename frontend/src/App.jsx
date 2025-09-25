import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Victim from "./components/dashboard/Victim";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import AdminLogin from "./pages/AdminLogin";
import HomePage from "./pages/HomePage";

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/v1/rumman/auth/me");

        const data = await res.json(); // Parse JSON before checking
        if (!res.ok) {
          throw new Error(data.error || "An unknown error occurred");
        }

        console.log("Auth user is here:", data);
        return data;
      } catch (error) {
        console.log("Error fetching auth user:", error);
        throw error;
      }
    },
    retry: false,
  });

  return (
    <MantineProvider>
      <div className=" min-h-screen bg-white">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                authUser={authUser && authUser}
                isLoading={isLoading && isLoading}
              />
            }
          />
           <Route
            path="/watching/victim"
            element={authUser && authUser?.role === "admin" && <Victim />}
          />
          <Route
            path="/admin/cloud/login"
            element={
              !authUser ||
              authUser?.role !== "admin" ||
              authUser?.role === "admin" ? (
                <AdminLogin />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
        <Toaster />
      </div>
    </MantineProvider>
  );
}

export default App;
