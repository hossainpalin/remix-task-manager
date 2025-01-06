import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher } from "@remix-run/react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { cn } from "~/lib/utils";
import { UserLogin, userLoginSchema } from "~/schema";
import { FetcherData } from "~/types";

export default function LoginForm() {
  const fetcher = useFetcher<FetcherData>();

  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors }
  } = useForm<UserLogin>({
    resolver: zodResolver(userLoginSchema),
    mode: "onBlur",
    shouldFocusError: false,
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = (data: UserLogin) => {
    fetcher.submit(data, { method: "POST", action: "/login" });
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
      <h1 className="text-2xl font-medium text-gray-200">Login to continue</h1>

      {errors.root && (
        <p className="mt-5 w-full px-4 py-3 rounded-md bg-red-800/30 border border-red-800/30 text-gray-300 font-light flex justify-start items-center gap-2">
          <span className="inline-block">
            <AlertTriangle className="size-6" />
          </span>
          <span className="inline-block">{errors.root.message}</span>
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
            "Login"
          )}
        </button>
      </fetcher.Form>
    </div>
  );
}
