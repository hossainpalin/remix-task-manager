import { useContext } from "react";
import { TodoContext } from "~/contexts/todo-context";

export function useEditTodo() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useEditTodo must be used within a TodoProvider");
  }

  return context;
}
