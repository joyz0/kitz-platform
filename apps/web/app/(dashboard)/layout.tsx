  import { auth } from "@/lib/auth";
  import * as React from "react";
  import ChatBot from "@repo/ui/chat-bot";
  
  export default async function DashboardLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const session = await auth();
  
    return (
      <div>
         {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child as React.ReactElement<any>, {
                session,
              });
            }
            return child;
          })}
          <ChatBot />
      </div>
    );
  }
  