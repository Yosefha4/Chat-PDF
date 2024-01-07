import FileUpload from "../components/FileUpload";
import MyButton from "../components/MyButton";
import { UserButton, auth } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;
  return (
    <div className="w-screen h-screen	 min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400  ">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">Chat with any PDF</h1>
            <UserButton afterSignOutUrl="/" />
          </div>

          <div className="flex mt-2">
            {isAuth && <MyButton title="Go To Chat" />}
          </div>

          <p className="max-w-xl mt-1 text-lg text-slate-600">
            Join millions of students, researchers and professionals to
            instantly answer questions and understand research with AI
          </p>

          <div className="w-full mt-4">
            {isAuth ? (
              <FileUpload />
            ) : (
              <Link href="/sign-in">
                <MyButton title="Login to get Started!" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// export default Home;
