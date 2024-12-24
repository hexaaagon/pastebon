"use client";

import { useState } from "react";

import { Clipboard, Eye, EyeClosed } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { absoluteUrl } from "@/lib/utils";

const PASTEURL = absoluteUrl("/paste");

export function DoneDialog({ id, password }: { id: string; password: string }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          Paste <strong className="font-mono">{id}</strong>
        </DialogTitle>
      </DialogHeader>
      <div className="flex flex-col space-y-2 *:space-y-1">
        <div>
          <Label htmlFor="paste_url" className="text-right">
            Paste URL
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="paste_url"
              value={`${PASTEURL}/${id}`}
              className="col-span-3 font-mono"
              readOnly
            />
            <Button
              size="icon"
              className="w-12"
              onClick={() => {
                navigator.clipboard.writeText(`${PASTEURL}/${id}`);

                toast.success("Copied to Clipboard.");
              }}
            >
              <Clipboard />
            </Button>
          </div>
        </div>
        <div>
          <Label htmlFor="password" className="text-right">
            Admin Password
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="password"
              value={password}
              className="col-span-3 font-mono"
              type={showPassword ? "text" : "password"}
              readOnly
            />
            <Button
              size="icon"
              className="w-12"
              onClick={() => setShowPassword((val) => !val)}
            >
              {showPassword ? <Eye /> : <EyeClosed />}
            </Button>
            <Button
              size="icon"
              className="w-12"
              onClick={() => {
                navigator.clipboard.writeText(password);

                toast.success("Copied to Clipboard.", {
                  description:
                    "This password will be used for editing this paste.",
                });
              }}
            >
              <Clipboard />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
