import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
  } from "@/components/ui/sidebar"
  
  export function AppSidebar() {
    return (
      <Sidebar
      side={"right"}
       variant={"inset"}
       collapsible={"offcanvas"}
      >
        <SidebarHeader />
        <SidebarContent className="bg-red-500">
          <SidebarGroup />
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
    )
  }
  