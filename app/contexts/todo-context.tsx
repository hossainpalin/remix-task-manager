import { createContext, ReactNode, useState } from "react";
import { Todo } from "~/types";

export interface TodoContextType {
  taskToEdit: Todo | null;
  setTaskToEdit: (task: Todo | null) => void;
}

export const TodoContext = createContext<TodoContextType | null>(null);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [taskToEdit, setTaskToEdit] = useState<Todo | null>(null);

  return (
    <TodoContext.Provider value={{ taskToEdit, setTaskToEdit }}>
      {children}
    </TodoContext.Provider>
  );
};
