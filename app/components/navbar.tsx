import { Form, Link, NavLink, useNavigate } from "@remix-run/react";
import { LogIn, LogOut } from "lucide-react";
import { User } from "~/types";

export default function Navbar({ user }: { user: User }) {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between mx-auto max-w-7xl">
      <Link to="/">
        <img
          className="w-[155px] h-[31px] hidden sm:block"
          src="/logo.svg"
          alt="logo"
        />
        <img
          className="size-[31px] block sm:hidden"
          src="/logo-icon.svg"
          alt="logo"
        />
      </Link>

      <ul className="flex justify-center items-center gap-8 font-light">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-blue-500" : "text-gray-300"
            }>
            Home
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/todo"
            className={({ isActive }) =>
              isActive ? "text-blue-500" : "text-gray-300"
            }>
            Todo
          </NavLink>
        </li>
      </ul>

      {user.userId ? (
        <Form method="post" action="/">
          <button type="submit" className="flex items-center text-gray-300">
            <p className="sm:flex flex-col items-end text-[12px] font-light hidden">
              <span>{user.name}</span>
              <span>{user.email}</span>
            </p>
            <LogOut className="w-10" />
          </button>
        </Form>
      ) : (
        <>
          <button
            onClick={() => navigate("/login")}
            className="flex items-center text-gray-300">
            <p className="sm:flex flex-col items-end text-[12px] font-light hidden">
              <span>Welcome</span>
              <span>Login to get started</span>
            </p>
            <LogIn className="w-10" />
          </button>
        </>
      )}
    </nav>
  );
}
