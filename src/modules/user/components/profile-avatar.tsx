"use client";

/**
 * ProfileAvatar Component
 * Simple avatar with upload functionality
 */

import React, { useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";

interface ProfileAvatarProps {
  name: string;
  className?: string;
}

export function ProfileAvatar({ name, className }: ProfileAvatarProps): React.JSX.Element {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={handleClick}
        className="relative w-20 h-20 rounded-full overflow-hidden transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {getInitials(name)}
            </span>
          </div>
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        aria-label="Upload profile picture"
      />
    </div>
  );
}
