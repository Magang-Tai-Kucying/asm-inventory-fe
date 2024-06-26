"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "react-hot-toast"

// utils
import NavBar from "../../../utils/navbar"
import SideBar from "../../../utils/sidebar"

// components
import Assets from "./assets/assets"
import Pembelian from "./pembelian/pembelian"
import Catatan from "./catatan/catatan"
import KartuStok from "./kartuStok/kartuStok"
import Keluhan from "./keluhan/keluhan"

import { useState, useLayoutEffect, useEffect } from "react"
import Auth from "@/utils/auth"

const queryClient = new QueryClient()

export default function InventoryComp() {
  const [visible, setVisible] = useState(false)
  const [activeContent, setActiveContent] = useState(0)

  return (
    <QueryClientProvider client={queryClient}>
      <Auth>
        <div
          style={{ backgroundColor: "#eff3f8", height: "100vh" }}
          className="flex flex-column p-5"
        >
          {/* NAVBAR  */}
          <div className="bg-white flex justify-content-start border-round-md py-3">
            <NavBar visible={visible} setVisible={setVisible} />
            {/* sidebar  */}
            <SideBar
              visible={visible} // true or false
              setVisible={setVisible}
              activeContent={activeContent}
              setActiveContent={setActiveContent}
            />
          </div>
          {/* CONTENT  */}
          <div className="bg-white border-round-md w-full py-2 mt-5 h-full">
            {/* kondisi  */}
            {activeContent === 0 ? (
              <Assets />
            ) : activeContent === 1 ? (
              <Pembelian />
            ) : activeContent === 2 ? (
              <Catatan />
            ) : activeContent === 3 ? (
              <KartuStok />
            ) : activeContent === 4 ? (
              <Keluhan />
            ) : (
              // <KartuStok />
              <></>
            )}
          </div>
        </div>
      </Auth>
    </QueryClientProvider>
  )
}
