import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import { db } from "../../../lib/db";
import { chats } from "../../../lib/db/schema";
import { eq } from "drizzle-orm";
import ChatSideBar from "../../../components/ChatSideBar";

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!_chats) {
    return redirect("/");
  }
  // if (!_chats.find(chat => chat.id === parseInt(chatId) )) {
  //   return redirect("/");
  // }
  return (
    <div className="flex max-h-screen overflow-scroll">
      <div className="flex w-full max-h-screen ">
        {/* chat sidebar */}
        <div className="flex-[1] max-w-xs">
          <ChatSideBar chats={_chats} chatId={parseInt(chatId)} />
          </div>

        {/* pdf viewer */}
        <div className="max-h-screen p-4  flex-[5]">
          {/* <PDFViewer /> */}
        </div>

        {/* chat component */}
        <div className="flex-[3] border-l-4 border-l-slate-200">
          {/* <ChatComponent /> */}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
