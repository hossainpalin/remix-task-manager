// This is the route for the todo task completion
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { getUserSession } from "~/firebase/server.session";
import { completeTodo, deleteTodo } from "~/actions/todo.actions";

export async function action({ request, params }: ActionFunctionArgs) {
  const userSession = await getUserSession(request);

  if (!userSession) {
    return redirect("/login");
  }

  const taskId = params.id;
  const body = await request.text();
  const data = JSON.parse(body);

  if (data && data.method === "PATCH") {
    await completeTodo(taskId as string, data.completed);
  }

  if (data && data.method === "DELETE") {
    await deleteTodo(taskId as string);

    return new Response(JSON.stringify({ status: 200, success: true }));
  }

  return redirect("/todo");
}
