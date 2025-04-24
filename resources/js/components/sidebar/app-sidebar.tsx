import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "@inertiajs/react";
import {
    ShoppingCart,
    ChevronDown,
    LayoutDashboard,
    Receipt,
} from "lucide-react";

export function AppSidebar() {
    const { state, isMobile } = useSidebar();

    return (
        <Sidebar side="left" collapsible="icon" variant="sidebar">
            <SidebarContent className="pt-4 md:pt-10">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem key={"dashboard"}>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={"Dashboard"}
                                >
                                    <Link href={"/dashboard"}>
                                        <LayoutDashboard />
                                        Dashboard
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem key={"trips"}>
                                <Collapsible
                                    className="group/collapsible"
                                    defaultOpen
                                >
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton tooltip={"Products"}>
                                            <ShoppingCart />
                                            <span className="text-md">
                                                Products
                                            </span>
                                            <ChevronDown />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>

                                    <CollapsibleContent>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                <SidebarMenuSubItem>
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        key={"School Supplies"}
                                                    >
                                                        <Link
                                                            href={
                                                                "/products/supplies"
                                                            }
                                                        >
                                                            <span>
                                                                {
                                                                    "School Supplies"
                                                                }
                                                            </span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                                <SidebarMenuSubItem>
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        key={"Food"}
                                                    >
                                                        <Link
                                                            href={
                                                                "/products/food"
                                                            }
                                                        >
                                                            <span>
                                                                {"Food"}
                                                            </span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </CollapsibleContent>
                                </Collapsible>
                            </SidebarMenuItem>

                            <SidebarMenuItem key={"billing"}>
                                <Collapsible
                                    defaultOpen
                                    className="group/collapsible"
                                >
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton tooltip={"Billing"}>
                                            <Receipt />
                                            <span className="text-md">
                                                Billing
                                            </span>
                                            <ChevronDown />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    {/* <CollapsibleTrigger asChild>
                                        <SidebarMenuButton>
                                            <Receipt />
                                            Billing
                                            <ChevronDown />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger> */}
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {/* <SidebarMenuSubItem>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    key={'quotations'}
                                                >
                                                    <Link href={'/quotations'}>
                                                        Quotations
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem> */}
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    key={"orders"}
                                                >
                                                    <Link href={"/orders"}>
                                                        <span>Orders</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    key={"invoices"}
                                                >
                                                    <Link href={"/invoices"}>
                                                        <span>
                                                            {"Invoices"}
                                                        </span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </Collapsible>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    {/* <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem key={"dashboard"}>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={"Privacy Policy"}
                                >
                                    <Link href={route("privacyPolicy")}>
                                        <BookOpenText />
                                        <span className="text-sm">
                                            Privacy Policy
                                        </span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                        <SidebarMenu>
                            <SidebarMenuItem key={"dashboard"}>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={"Terms Of Service"}
                                >
                                    <Link href={route("termsOfService")}>
                                        <BookOpenText />
                                        <span className="text-sm">
                                            Terms Of Service
                                        </span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent> */}
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                {state === "expanded" && (
                    <div className="flex justify-center">
                        <span className="text-[10px]">
                            &copy; HEROES Malaysia
                        </span>
                    </div>
                )}
            </SidebarFooter>
        </Sidebar>
    );
}
