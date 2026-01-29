import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import HomeUI from "./ui";
import { AIRecommendedStudies } from "@/components/AIRecommendedStudies";

export default function HomePage() {
  return (
    <>
      <HomeUI />
        <section className="my-8 px-4">
        <AIRecommendedStudies />
      </section>
    </>
  );
  
}
