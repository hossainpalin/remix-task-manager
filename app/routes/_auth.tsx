import { Outlet } from "@remix-run/react";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getUserSession } from "~/firebase/server.session";

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await getUserSession(request);

  if (sessionUser) {
    return redirect("/");
  }

  return null;
}

export default function Auth() {
  return (
    <div className="flex min-h-screen">
      <section className="hidden w-1/2 items-center justify-center bg-gray-800 p-10 lg:flex xl:w-2/5">
        <div className="flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12">
          <img
            src="/logo.svg"
            alt="logo"
            width="224"
            height="82"
            className="h-auto"
          />

          <div className="space-y-5 text-white">
            <h1 className="text-4xl font-bold leading-[42px]">
              Manage your daily tasks with easiest way
            </h1>
            <p className="text-lg font-light text-gray-300">
              We provide you with the tools you need to manage your tasks
              efficiently.
            </p>
          </div>
          <img
            src="/task-icon.svg"
            alt="Files"
            width={342}
            height={342}
            className="transition-all hover:rotate-2 hover:scale-105"
          />
        </div>
      </section>

      <section className="flex flex-1 flex-col items-center bg-gray-900 p-4 py-10 lg:justify-center lg:p-10 lg:py-0">
        <div className="mb-16 lg:hidden">
          <img
            src="/logo.svg"
            alt="logo"
            width="224"
            height="82"
            className="h-auto w-[200px] lg:w-[250px]"
          />
        </div>
        <Outlet />
      </section>
    </div>
  );
}
