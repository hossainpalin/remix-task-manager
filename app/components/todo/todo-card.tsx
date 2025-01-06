import { useNavigate } from "@remix-run/react";
import { Pencil, Trash2 } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { useEditTodo } from "~/hooks/use-edit-todo";
import { cn } from "~/lib/utils";
import { Todo } from "~/types";

export default function TodoCard({ todo }: { todo: Todo }) {
  const { id, completed, task } = todo;
  const [taskCompleted, setTaskCompleted] = useState<boolean>(completed);
  const navigate = useNavigate();
  const { setTaskToEdit } = useEditTodo();

  // Update the todo task completion status
  const handleCompleted = async (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;

    setTaskCompleted(checked);

    await fetch(`/api/todo/${id}`, {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: JSON.stringify({ completed: checked, method: "PATCH" })
    });
  };

  // Delete the todo task
  const handleDelete = async () => {
    const response = await fetch(`/api/todo/${id}`, {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: JSON.stringify({ method: "DELETE" })
    });

    if (response.ok) {
      navigate("/todo");
    }
  };

  // Edit the todo task
  const handleEdit = () => {
    setTaskToEdit(todo);
  };

  return (
    <div className="w-full flex items-center justify-between max-w-4xl px-4 py-3 rounded-md bg-gray-900 border border-gray-800 text-gray-300 flex-wrap">
      <div className="flex justify-center items-center gap-3">
        <div className="flex items-center cursor-pointer relative">
          <input
            onChange={handleCompleted}
            defaultChecked={completed}
            type="checkbox"
            className="peer size-5 cursor-pointer transition-all appearance-none rounded-full shadow hover:shadow-md border border-gray-500 checked:bg-gray-800 checked:border-gray-800"
          />
          <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              viewBox="0 0 20 20"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"></path>
            </svg>
          </span>
        </div>

        <p
          className={cn(
            "font-light",
            taskCompleted && "line-through text-gray-500"
          )}>
          {task}
        </p>
      </div>

      <div className="flex items-center justify-center gap-5">
        <button
          onClick={handleEdit}
          className="p-1.5 bg-gray-800 rounded-md hover:bg-green-800 group">
          <Pencil className="size-[20px] text-gray-400 group-hover:text-white" />
        </button>
        <button
          onClick={handleDelete}
          className="p-1.5 bg-gray-800 rounded-md hover:bg-red-800 group">
          <Trash2 className="size-[20px] text-gray-400 group-hover:text-white" />
        </button>
      </div>
    </div>
  );
}
