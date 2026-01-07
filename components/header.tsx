"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { useLogout } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/reactQuery/queryKeys";
import { useUser } from "@/hooks/useUser";
import { getImageUrl, getProfileImageUrl } from "@/utils/supabase/storage";

export function Header() {
  const logoutMutation = useLogout();
  // const [user, setUser] = useState<
  //   | (User & {
  //       notifications: number;
  //       name: string;
  //       initials: string | undefined;
  //     })
  //   | null
  // >(null);

  const { data: user, isLoading } = useUser();
  // useEffect(() => {
  //   if (userData) {
  //     setUser({
  //       ...userData,
  //       notifications: 3,
  //       name: "정재원",
  //       initials: userData.email?.charAt(0),
  //     });
  //   }
  // }, [userData]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-foreground hover:text-accent transition-colors"
          >
            <div className="w-8 h-8 rounded-md bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">
              📚
            </div>
            Study Mate
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/posts"
              className="text-foreground hover:text-accent transition-colors font-medium"
            >
              모집글
            </Link>
            <Link
              href="/chats"
              className="text-foreground hover:text-accent transition-colors font-medium"
            >
              채팅
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Search Bar - Hidden on mobile */}
            <div className="hidden lg:flex items-center bg-muted rounded-lg px-3 py-2 w-64">
              <span className="text-muted-foreground">🔍</span>
              <input
                type="text"
                placeholder="스터디 검색..."
                className="bg-muted text-foreground placeholder-muted-foreground outline-none ml-2 w-full text-sm"
              />
            </div>
            {/* Notifications */}
            {user && (
              <button className="relative p-2 text-foreground hover:bg-muted rounded-lg transition-colors">
                🔔
                {user?.notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-danger text-white text-xs">
                    {user.notifications || 0}
                  </Badge>
                )}
              </button>
            )}
            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={getProfileImageUrl(user.avatar_url) || "/placeholder.svg"} alt={user.username} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm font-medium text-foreground">
                      {user.username}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="cursor-pointer">
                    <Link href="/profile" className="w-full">
                      프로필
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Link href="/profile" className="w-full">
                      내 스터디
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                  >
                    {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button>
                <Link href="/auth/login">로그인</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
