import RegisterForm from "~/components/auth/register-form";
import { Link, MetaFunction } from "@remix-run/react";
import { ActionFunctionArgs } from "@remix-run/node";
import { userRegisterSchema } from "~/schema";
import { userRegister } from "~/firebase/auth";
import { createUserSession } from "~/firebase/server.session";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Register for an account"
    }
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const body = Object.fromEntries(formData);

  try {
    const { name, email, password } = userRegisterSchema.parse(body);
    const { error, user } = await userRegister(name, email, password);

    if (error) {
      return { error };
    }

    if (user?.verified === false) {
      return { error: "Please verify your email address to login." };
    }

    return await createUserSession(user?.token as string, "/todo");
  } catch (error) {
    return { error };
  }
}

export default function Register() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <RegisterForm />

      <div className="flex items-center justify-center text-gray-400 font-light mt-3.5">
        <span className="inline-block">Already have an account</span>
        <span className="inline-block pl-1.5">
          <Link
            to="/login"
            className="text-blue-600 underline hover:text-blue-500">
            Login here.
          </Link>
        </span>
      </div>
    </div>
  );
}
