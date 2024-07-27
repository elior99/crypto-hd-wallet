"use client";
import "../../assets/toastify-custom.css";
import "react-toastify/dist/ReactToastify.css";
import Main from "../components/Main/Main";
import SessionContext from "../lib/sessionContext";
import { ThemeProvider } from "@/components/ThemeProvider/ThemeProvider";
import { ToastContainer } from "react-toastify";

export default function Home() {
  return (
    <ThemeProvider>
      <main className="flex min-h-screen flex-col items-center justify-center dark:bg-white">
        <SessionContext>
          <Main />
        </SessionContext>
      </main>
      <ToastContainer />
    </ThemeProvider>
  );
}
