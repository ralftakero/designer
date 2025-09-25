import React from "react";
import Layout from "../components/layout/Layout";
import { MdOutlineCloudDone } from "react-icons/md";

function SuccessPage() {
  return (
    <Layout>
      <div className=" pt-[44px]">
        <div className=" w-full flex flex-col items-center">
          <div className=" sm:w-[640px] w-full h-screen sm:h-[610px] apple-shadow sm:rounded-[34px] sm:mt-[44px]">
            <div className=" w-full h-full flex flex-col items-center justify-center">
              <div>
                <MdOutlineCloudDone className=" w-24 h-24 opacity-45" />
              </div>
              <p className=" text-[#494949] text-[18px] font-[400]">
                Your account has been successfully confirmed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default SuccessPage;
