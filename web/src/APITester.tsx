import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";
import { useRef, type FormEvent } from "react";

export function APITester() {
  const responseInputRef = useRef<HTMLTextAreaElement>(null);

  const testEndpoint = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="backdrop-blur-lg border-muted mx-auto w-full max-w-2xl text-left flex flex-col gap-4 container relative z-10">
      <form
        onSubmit={testEndpoint}
        className="flex flex-col items-center gap-6 bg-card rounded-xl font-mono border border-none w-full p-10"
      >
        <h1 className="text-4xl font-bold">Star</h1>
        <div className="flex flex-col gap-2">
          <Label htmlFor="abc">abc</Label>
          <Input
            type="text"
            name="user"
            defaultValue=""
            className="w-2xs"
            placeholder="默认账户:admin"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="abc">abc</Label>
          <Input
            type="abc"
            name="abc"
            defaultValue=""
            className={"w-2xs"}
            placeholder="abc"
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" variant="secondary">
            登录
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost">abc?</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>删除 abcdefg 文件可恢复初始功能配置</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </form>
    </div>
  );
}
