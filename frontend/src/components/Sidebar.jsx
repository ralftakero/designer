import React from "react";
import { NavLink } from "react-router-dom";
import { TbChessBishop } from "react-icons/tb";
import { SiLichess } from "react-icons/si";

function Sidebar() {
  return (
    <div className=" w-60 bg-zinc-900 h-screen fixed left-0 top-0 text-white p-3 border-r border-zinc-800">
      <div>
        <div className=" w-full flex items-center justify-center">
          <SiLichess className=" w-20 h-20 text-zinc-300" />
        </div>
        <div className=" flex flex-col gap-3 mt-5">
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 px-3 rounded-sm ${
                isActive && "bg-zinc-800"
              }`
            }
            to="/watching/victim"
          >
            <TbChessBishop />
            <p className=" text-sm">Brothers</p>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
