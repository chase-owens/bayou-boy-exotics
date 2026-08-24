import {
  Clock,
  Gift,
  Home,
  Leaf,
  Folder,
  Ticket,
  Users,
  type LucideProps,
} from "lucide-react";
import type { ForwardRefExoticComponent } from "react";

type NavItem = {
  label: string;
  to: string;
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  isAdminOnly?: boolean;
};

export const adminNavItems: NavItem[] = [
  { label: "Dashboard", to: "/", Icon: Home },
  { label: "Products", to: "/products", Icon: Leaf },
  { label: "Meet Times", to: "/meet-times", Icon: Clock },
  { label: "Reservations", to: "/reservations", Icon: Users },
  { label: "Featured Deals", to: "/featured-deals", Icon: Gift },
  { label: "Giveaways", to: "/giveaways", Icon: Ticket },
  { label: "Categories", to: "/categories", Icon: Folder },
  {
    label: "Users",
    to: "/users",
    Icon: Users,
    isAdminOnly: true,
  },
];
