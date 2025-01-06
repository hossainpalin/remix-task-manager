import { FileText } from "lucide-react";
import TodoCard from "~/components/todo/todo-card";
import { Todo } from "~/types";

export default function TodoList({ todos }: { todos: Todo[] }) {
  if (todos.length <= 0) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="flex flex-col items-center">
          <FileText className="size-24 text-gray-500 mb-2" />
          <p className="text-gray-500 text-2xl font-medium">No tasks found</p>
          <p className="font-light text-gray-500">
            Add a new task to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl h-full sm:max-h-[550px] sm:overflow-x-auto flex flex-col justify-start items-center space-y-3">
      {todos.map((todo) => (
        <TodoCard key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
