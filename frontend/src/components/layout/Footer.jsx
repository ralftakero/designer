import React from "react";

function Footer() {
  return (
    <div className=" h-[82px] py-[30px] w-full bg-[#f2f2f7] flex items-center justify-center sm:mt-[140px] lg:mt-[160px]">
      <div className=" max-w-[345px] sm:max-w-[690px] lg:max-w-[1035px] w-full">
        <div className=" flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[5px] sm:gap-[12px] text-[11.6px] font-[400] text-[rgba(0,0,0,0.56)]">
          <div className=" flex items-center gap-[10px]">
            <div className=" pr-[11px] border-r border-[rgba(0,0,0,0.12)] tracking-[0.028em]">
              System Status
            </div>
            <div className=" pr-[11px] border-r border-[rgba(0,0,0,0.12)] tracking-[0.028em]">
              Privacy Policy
            </div>
            <div className=" tracking-[0.028em]">Terms & Conditions</div>
          </div>
          <div>
            <p className=" tracking-[0.034em]">
              Copyright &#169; {new Date().getFullYear()} Apple Inc. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
