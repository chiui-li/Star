import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import React, { useRef, type FormEvent } from "react";
import { useForm } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "./components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export function LoginComponent() {
  const responseInputRef = useRef<HTMLTextAreaElement>(null);

  const testEndpoint = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <div className="backdrop-blur-lg w-96 border-muted mx-auto  text-left flex flex-col gap-4 container relative z-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((loginValue) => {
            console.log(loginValue);
          })}
          className="flex flex-col place-items-start gap-6 bg-card rounded-xl font-mono border border-none w-full p-10"
        >
          <h1 className="text-4xl font-bold">Star</h1>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <>
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>账户</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      name="username"
                      defaultValue=""
                      className={"w-2xs"}
                      placeholder="默认账户:admin"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <>
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>密码</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      name="password"
                      defaultValue=""
                      className={"w-2xs"}
                      placeholder="默认密码:admin"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />

          <div className="flex gap-2 justify-center w-full">
            <Button type="submit" variant="secondary">
              登录
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost">忘记密码?</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>删除 abcdefg 文件可恢复初始功能配置</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </form>
      </Form>
    </div>
  );
}
