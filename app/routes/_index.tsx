import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, MetaFunction, useLoaderData } from "@remix-run/react";
import { FileText } from "lucide-react";
import { getCurrentUser } from "~/firebase/server.session";
import RootLayout from "~/layout/root-layout";
import { User } from "~/types";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Welcome to Remix!"
    }
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  return getCurrentUser(request);
}

export default function Index() {
  const currentUser = useLoaderData<typeof loader>();

  let user: User;

  if (!currentUser) {
    user = {
      userId: "",
      name: "",
      email: ""
    };
  } else {
    user = {
      userId: currentUser?.userId as string,
      name: currentUser?.name as string,
      email: currentUser?.email as string
    };
  }

  return (
    <RootLayout user={user}>
      <section className="w-full h-full flex flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          <FileText className="size-28 text-gray-500 mb-2" />
        </div>

        <h1 className="w-full max-w-4xl text-4xl font-bold text-center mt-10 text-gray-300">
          Welcome to remix! Task Manager App
        </h1>
        <p className="w-full max-w-4xl text-lg text-gray-400 mt-5 text-center">
          This is a simple task manager app built with Remix and Firebase. You
          can add, delete, and update tasks. You can also mark tasks as done.
        </p>
        <Link
          to="/todo"
          className="p-3 bg-blue-600 hover:bg-blue-700 w-[180px] rounded-md text-white mt-5 flex justify-center items-center">
          Create Todo
        </Link>
      </section>
    </RootLayout>
  );
}
