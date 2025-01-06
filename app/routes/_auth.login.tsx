import { ActionFunctionArgs } from "@remix-run/node";
import { Link, MetaFunction } from "@remix-run/react";
import LoginForm from "~/components/auth/login-form";
import { userLogin } from "~/firebase/auth";
import { createUserSession } from "~/firebase/server.session";
import { userLoginSchema } from "~/schema";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Login to your account"
    }
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const body = Object.fromEntries(formData);

  try {
    const { email, password } = userLoginSchema.parse(body);
    const { error, user } = await userLogin(email, password);

    if (error) {
      return { error };
    }

    if (user?.userId && user?.verified === false) {
      return { error: "Please verify your email address to login." };
    }

    return await createUserSession(user?.token as string, "/todo");
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "Something went wrong!" };
    }
  }
}

export default function Login() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <LoginForm />

      <div className="flex items-center justify-center text-gray-400 font-light mt-3.5">
        <span className="inline-block">Don&apos;t have an account? </span>
        <span className="inline-block pl-1.5">
          <Link
            to="/register"
            className="text-blue-600 underline hover:text-blue-500">
            Register here.
          </Link>
        </span>
      </div>
    </div>
  );
}
