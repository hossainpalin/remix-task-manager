import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect
} from "@remix-run/node";
import { Await, MetaFunction, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { createTodo, getTodos, updateTodo } from "~/actions/todo.actions";
import TodoInput from "~/components/todo/todo-input";
import TodoList from "~/components/todo/todo-list";
import { getCurrentUser, getUserSession } from "~/firebase/server.session";
import RootLayout from "~/layout/root-layout";
import { User } from "~/types";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Todo List"
    }
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const userTodos = getTodos(request);
  const [currentUser, userSession] = await Promise.all([
    getCurrentUser(request),
    getUserSession(request)
  ]);

  if (!userSession) {
    return redirect("/login");
  }

  return { currentUser, userTodos };
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method === "POST") {
    await createTodo(request);
  } else {
    await updateTodo(request);
  }

  return redirect("/todo");
}

export default function Todo() {
  const { currentUser, userTodos } = useLoaderData<typeof loader>();

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
      <section className="w-full h-full flex flex-col items-center justify-between py-4 sm:py-12">
        <Suspense fallback={<div className="text-gray-300">Loading...</div>}>
          <Await resolve={userTodos}>
            {(todos) => <TodoList todos={todos} />}
          </Await>
        </Suspense>

        <div className="max-w-4xl block sm:hidden w-full fixed bottom-0 left-0 right-0 p-4 bg-gray-800 border-t border-gray-700">
          <TodoInput />
        </div>

        <div className="max-w-4xl hidden sm:block w-full">
          <TodoInput />
        </div>
      </section>
    </RootLayout>
  );
}
