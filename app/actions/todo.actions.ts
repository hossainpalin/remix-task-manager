import { redirect } from "@remix-run/node";
import { db } from "~/firebase/firebase.server";
import { getUserSession } from "~/firebase/server.session";
import { Todo } from "~/types";

// Get all todos for a user
export async function getTodos(request: Request): Promise<Todo[] | any> {
  const userSession = await getUserSession(request);

  if (!userSession) {
    return redirect("/login");
  }

  try {
    const tasks = await db
      .collection("tasks")
      .orderBy("createdAt", "desc")
      .where("userId", "==", userSession.uid)
      .get();

    return tasks.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data()
      };
    });
  } catch (error) {
    console.error("Error getting documents  ", error);
    return redirect("/login");
  }
}

// Create a new todo
export async function createTodo(request: Request) {
  const userSession = await getUserSession(request);
  const formData = await request.formData();
  const task = formData.get("task");

  if (!userSession) {
    return redirect("/login");
  }

  try {
    await db.collection("tasks").add({
      userId: userSession.uid,
      task: task,
      completed: false,
      createdAt: new Date().toISOString()
    });

    return redirect("/todo");
  } catch (error) {
    console.error("Error adding document: ", error);
    return redirect("/login");
  }
}

// Update a todo
export async function updateTodo(request: Request) {
  const userSession = await getUserSession(request);
  const formData = await request.formData();
  const task = formData.get("task");
  const taskId = formData.get("taskId");

  if (!userSession) {
    return redirect("/login");
  }

  await db
    .collection("tasks")
    .doc(taskId as string)
    .update({
      task: task
    });

  return redirect("/todo");
}

// Delete a todo
export async function deleteTodo(taskId: string) {
  await db.collection("tasks").doc(taskId).delete();
  return null;
}

// Complete a todo
export async function completeTodo(taskId: string, completed: boolean) {
  await db
    .collection("tasks")
    .doc(taskId as string)
    .update({
      completed: completed
    });
  return null;
}
