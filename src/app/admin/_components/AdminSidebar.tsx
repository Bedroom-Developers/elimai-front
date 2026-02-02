"use client"

import { Button } from "@/shared/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar"
import { CalendarIcon, MoveLeftIcon, UsersIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function AdminSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border">
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link href="/">

              <MoveLeftIcon className="size-4" />
              <span>На главную</span>
            </Link>
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/admin"}>
                    <Link href="/admin">
                      <CalendarIcon className="size-4" />
                      <span>События</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/admin/volunteers"}>
                    <Link href="/admin/volunteers">
                      <UsersIcon className="size-4" />
                      <span>Волонтеры</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-2  px-4">
          <SidebarTrigger />
        </header>
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
