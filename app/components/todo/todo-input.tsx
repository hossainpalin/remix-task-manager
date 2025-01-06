import { useSubmit } from "@remix-run/react";
import { ArrowUp, Plus } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useEditTodo } from "~/hooks/use-edit-todo";

export default function TodoInput() {
  const { taskToEdit, setTaskToEdit } = useEditTodo();
  const [task, setTask] = useState<string>("");
  const submit = useSubmit();

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    if (taskToEdit) {
      const formData = new FormData(form);
      formData.append("taskId", taskToEdit.id);

      submit(formData, { method: "PUT", action: "/todo" });
      setTaskToEdit(null);
      setTask("");
    } else {
      submit(form, { method: "POST", action: "/todo" });
      setTask("");
    }
  };

  useEffect(() => {
    if (taskToEdit?.id) {
      setTask(taskToEdit.task);
    }
  }, [taskToEdit]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex justify-center items-center gap-5">
      <input
        required
        type="text"
        name="task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Add a new task..."
        className="w-full px-4 py-3 rounded-md bg-gray-900 border border-gray-800 focus:border-blue-500 outline-none text-gray-300"
      />
      <button
        type="submit"
        className="p-3 bg-gray-900 border border-gray-800 rounded-md">
        {taskToEdit?.id ? (
          <ArrowUp className="size-6 text-gray-300" />
        ) : (
          <Plus className="size-6 text-gray-300" />
        )}
      </button>
    </form>
  );
}
