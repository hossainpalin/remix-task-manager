import { ReactNode } from "react";
import Navbar from "~/components/navbar";
import { User } from "~/types";

export default function RootLayout({
  children,
  user
}: {
  children: ReactNode;
  user: User;
}) {
  return (
    <div className="w-full h-full flex flex-col justify-start">
      <header className="w-full dark:bg-gray-900 py-4 px-4">
        <Navbar user={user} />
      </header>
      <main className="w-full h-full flex flex-col justify-start items-center px-4">
        {children}
      </main>
    </div>
  );
}
