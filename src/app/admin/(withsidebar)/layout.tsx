import { AdminSidebar } from "../_components/AdminSidebar";

export default function WithSidebarLayout({ children }: { children: React.ReactNode }) {
    return <AdminSidebar>{children}</AdminSidebar>
}