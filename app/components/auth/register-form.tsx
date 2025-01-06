import { useFetcher } from "@remix-run/react";
import { UserRegister, userRegisterSchema } from "~/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn } from "~/lib/utils";
import { useEffect } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { FetcherData } from "~/types";

export default function RegisterForm() {
  const fetcher = useFetcher<FetcherData>();

  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors }
  } = useForm<UserRegister>({
    resolver: zodResolver(userRegisterSchema),
    mode: "onBlur",
    shouldFocusError: false,
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });

  const onSubmit = (data: UserRegister) => {
    fetcher.submit(data, { method: "POST", action: "/register" });
  };

  useEffect(() => {
    if (fetcher.data?.error) {
      setError("root", {
        type: "manual",
        message: fetcher.data.error
      });
    }
  }, [fetcher.data]);

  return (
    <div className="flex flex-col w-full max-w-[500px]">
      <h1 className="text-2xl font-medium text-gray-200">Create account</h1>

      {errors?.root?.type && (
        <p className="mt-5 w-full px-4 py-3 rounded-md bg-red-800/30 border border-red-800/30 text-gray-300 font-light flex justify-start items-center gap-2">
          <span className="inline-block">
            <AlertTriangle className="size-6" />
          </span>
          <span className="inline-block">{errors?.root?.message}</span>
        </p>
      )}

      <fetcher.Form
        className="mt-5 w-full"
        autoComplete="off"
        onSubmit={(e) => {
          clearErrors();
          handleSubmit(onSubmit)(e);
        }}>
        <div className="flex flex-col gap-5 w-full">
          <div>
            <input
              {...register("name")}
              className={cn(
                "w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none text-gray-300 font-light",
                errors.name && "border-red-800"
              )}
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-red-800 mt-1">{errors.name?.message}</p>
            )}
          </div>

          <div>
            <input
              {...register("email")}
              className={cn(
                "w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none text-gray-300 font-light",
                errors.email && "border-red-800"
              )}
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-800 mt-1">{errors.email?.message}</p>
            )}
          </div>

          <div>
            <input
              {...register("password")}
              className={cn(
                "w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none text-gray-300 font-light",
                errors.password && "border-red-800"
              )}
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-800 mt-1">{errors.password?.message}</p>
            )}
          </div>
        </div>

        <button
          disabled={fetcher.state === "submitting"}
          className="mt-8 w-full px-4 py-3 rounded-md bg-blue-700 border border-blue-700 text-white flex justify-center items-center gap-2"
          type="submit">
          {fetcher.state === "submitting" ? (
            <>
              <Loader2 className="animate-spin size-6" />
              <span>Processing...</span>
            </>
          ) : (
            "Register"
          )}
        </button>
      </fetcher.Form>
    </div>
  );
}
