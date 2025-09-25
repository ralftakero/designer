import React from "react";
import Layout from "../components/layout/Layout";

function Loading() {
  return (
    <Layout>
      <div className=" pt-[44px]">
        <div className=" w-full flex flex-col items-center">
          <div className=" sm:w-[640px] w-full h-screen sm:h-[610px] apple-shadow sm:rounded-[34px] sm:mt-[44px]">
            <div className=" w-full h-full flex items-center justify-center">
              <div className="h-[25px]  w-[25px]">
                <img
                  src="/appleLoader.gif"
                  alt=""
                  className=" w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Loading;
