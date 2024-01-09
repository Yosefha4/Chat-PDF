"use client";
import React from "react";
import { DrizzleChat } from "../lib/db/schema";
import Link from "next/link";
import MyButton from "./MyButton";
import { MessageCircle, PlusCircle } from "lucide-react";
import { cn } from "../lib/utils";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
};

const ChatSideBar = ({ chats, chatId }: Props) => {
  return (
    <div className="w-full h-screen p-4 text-gray-200 bg-gray-900">
      <Link href="/" className="w-full">
        <button className="flex items-center justify-center pt-1 pb-1  w-full border-dashed border-white border rounded-md">
          <PlusCircle className="mr-2 w-4 h-4" />
          New Chat
        </button>
        {/* <MyButton  title='Create New Chat'/> */}
      </Link>
      <div className="flex flex-col gap-2 mt-4">
        <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
          {" "}
          Test1.pdf
        </p>
        {/* {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div
              className={cn("rounded-lg p-3 bg-red-600 text-slate-300 flex items-center", {
                "bg-blue-600 text-white": chat.id === chatId,
                "hover:text-white": chat.id !== chatId,
              })}
            >
              <MessageCircle className="mr-2" />
              <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                Test1.pdf
         
              </p>
            </div>
          </Link>
        ))} */}
      </div>
    </div>
  );
};

export default ChatSideBar;
