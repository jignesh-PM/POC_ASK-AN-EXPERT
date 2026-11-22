import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number | string };

function IconBase({ children, size = 18, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

const line = (name: string, props: IconProps) => {
  const common = { ...props };
  switch (name) {
    case "search": return <IconBase {...common}><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></IconBase>;
    case "check": return <IconBase {...common}><path d="m5 12 4 4L19 7" /></IconBase>;
    case "chevron-right": return <IconBase {...common}><path d="m9 18 6-6-6-6" /></IconBase>;
    case "chevron-down": return <IconBase {...common}><path d="m6 9 6 6 6-6" /></IconBase>;
    case "chevron-up": return <IconBase {...common}><path d="m6 15 6-6 6 6" /></IconBase>;
    case "arrow-right": return <IconBase {...common}><path d="M5 12h14M13 6l6 6-6 6" /></IconBase>;
    case "arrow-left": return <IconBase {...common}><path d="M19 12H5M11 6l-6 6 6 6" /></IconBase>;
    case "arrow-up": return <IconBase {...common}><path d="M12 19V5M6 11l6-6 6 6" /></IconBase>;
    case "arrow-down": return <IconBase {...common}><path d="M12 5v14M6 13l6 6 6-6" /></IconBase>;
    case "arrow-up-right": return <IconBase {...common}><path d="M7 17 17 7M7 7h10v10" /></IconBase>;
    case "download":
    case "arrow-down-to-line": return <IconBase {...common}><path d="M12 3v12M7 10l5 5 5-5M5 21h14" /></IconBase>;
    case "user":
    case "circle-user":
    case "building": return <IconBase {...common}><circle cx="12" cy="8" r="3" /><path d="M5 21a7 7 0 0 1 14 0" /></IconBase>;
    case "users": return <IconBase {...common}><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></IconBase>;
    case "map-pin": return <IconBase {...common}><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></IconBase>;
    case "message": return <IconBase {...common}><path d="M21 15a3 3 0 0 1-3 3H8l-5 3V7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3Z" /></IconBase>;
    case "phone": return <IconBase {...common}><path d="M7 3H4a1 1 0 0 0-1 1c0 9 7 16 16 16a1 1 0 0 0 1-1v-3l-5-2-2 2c-3-1-5-3-6-6l2-2Z" /></IconBase>;
    case "mail": return <IconBase {...common}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></IconBase>;
    case "file":
    case "file-question":
    case "clipboard":
    case "book": return <IconBase {...common}><path d="M6 2h9l3 3v17H6Z" /><path d="M15 2v4h4M9 11h6M9 15h6" /></IconBase>;
    case "trash": return <IconBase {...common}><path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6" /></IconBase>;
    case "eye": return <IconBase {...common}><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></IconBase>;
    case "eye-off": return <IconBase {...common}><path d="m3 3 18 18M10.5 6.3A10 10 0 0 1 12 6c6.5 0 10 6 10 6a16 16 0 0 1-3 3.5M6.2 6.2C3.5 8 2 12 2 12s3.5 6 10 6c1.1 0 2.1-.2 3-.5" /></IconBase>;
    case "menu": return <IconBase {...common}><path d="M4 6h16M4 12h16M4 18h16" /></IconBase>;
    case "x": return <IconBase {...common}><path d="m6 6 12 12M18 6 6 18" /></IconBase>;
    case "globe": return <IconBase {...common}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></IconBase>;
    case "language": return <IconBase {...common}><path d="M5 5h7M8.5 5v14M5 9h7M14 12h7M17.5 12v7M14 19h7" /></IconBase>;
    case "bell": return <IconBase {...common}><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></IconBase>;
    case "shield": return <IconBase {...common}><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></IconBase>;
    case "key": return <IconBase {...common}><circle cx="8" cy="15" r="4" /><path d="m11 12 8-8M15 8l3 3M17 6l3 3" /></IconBase>;
    case "calculator":
    case "grid": return <IconBase {...common}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 3v18M15 3v18" /></IconBase>;
    case "headset": return <IconBase {...common}><path d="M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v6H5a1 1 0 0 1-1-1ZM20 14h-3v6h2a1 1 0 0 0 1-1Z" /></IconBase>;
    case "send": return <IconBase {...common}><path d="m3 3 18 9-18 9 4-9Z" /><path d="M7 12h14" /></IconBase>;
    case "sparkles": return <IconBase {...common}><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5ZM19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7Z" /></IconBase>;
    case "package": return <IconBase {...common}><path d="m12 2 9 5-9 5-9-5ZM3 7v10l9 5 9-5V7M12 12v10" /></IconBase>;
    case "refresh": return <IconBase {...common}><path d="M20 6v5h-5M4 18v-5h5" /><path d="A14 14 0 0 1 18 7l2 4M6 17l-2-4" /></IconBase>;
    case "rotate-ccw": return <IconBase {...common}><path d="M3 12a9 9 0 1 0 2.64-6.36L3 8" /><path d="M3 3v5h5M12 7v5l3 2" /></IconBase>;
    case "plus": return <IconBase {...common}><path d="M12 5v14M5 12h14" /></IconBase>;
    case "clock": return <IconBase {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l4 2" /></IconBase>;
    case "activity": return <IconBase {...common}><path d="M3 12h4l2-5 4 10 2-5h6" /></IconBase>;
    case "info":
    case "alert": return <IconBase {...common}><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7h.01" /></IconBase>;
    case "external": return <IconBase {...common}><path d="M14 3h7v7M10 14 21 3M21 14v7H3V3h7" /></IconBase>;
    case "login": return <IconBase {...common}><path d="M10 17l5-5-5-5M15 12H3M14 3h7v18h-7" /></IconBase>;
    case "logout": return <IconBase {...common}><path d="M14 17l-5-5 5-5M9 12h12M10 3H3v18h7" /></IconBase>;
    case "upload": return <IconBase {...common}><path d="M12 21V9M7 14l5-5 5 5M5 21h14" /></IconBase>;
    case "compass": return <IconBase {...common}><circle cx="12" cy="12" r="9" /><path d="m15 9-2 4-4 2 2-4Z" /></IconBase>;
    case "save": return <IconBase {...common}><path d="M4 3h13l3 3v15H4Z" /><path d="M8 3v6h8V3M8 21v-7h8v7" /></IconBase>;
    case "palette": return <IconBase {...common}><path d="M12 3a9 9 0 0 0 0 18h1a2 2 0 0 0 0-4h-1a2 2 0 0 1 0-4h3a6 6 0 0 0 0-12Z" /><circle cx="7.5" cy="10.5" r=".5" /><circle cx="9.5" cy="7" r=".5" /><circle cx="14" cy="7" r=".5" /></IconBase>;
    case "type": return <IconBase {...common}><path d="M5 5h14M12 5v14M8 19h8" /></IconBase>;
    case "workflow": return <IconBase {...common}><circle cx="5" cy="5" r="2" /><circle cx="19" cy="5" r="2" /><circle cx="12" cy="19" r="2" /><path d="M7 5h10M5 7v5h7v5M19 7v5h-7" /></IconBase>;
    case "zap": return <IconBase {...common}><path d="M13 2 4 14h7l-1 8 9-12h-7Z" /></IconBase>;
    default: return <IconBase {...common}><circle cx="12" cy="12" r="8" /></IconBase>;
  }
};

const makeIcon = (name: string) => function LocalIcon(props: IconProps) {
  return line(name, props);
};

export const ArrowRight = makeIcon("arrow-right");
export const ArrowLeft = makeIcon("arrow-left");
export const ArrowUp = makeIcon("arrow-up");
export const ArrowDown = makeIcon("arrow-down");
export const ArrowUpRight = makeIcon("arrow-up-right");
export const ArrowDownToLine = makeIcon("download");
export const Search = makeIcon("search");
export const Check = makeIcon("check");
export const ChevronRight = makeIcon("chevron-right");
export const ChevronDown = makeIcon("chevron-down");
export const ChevronUp = makeIcon("chevron-up");
export const UserRound = makeIcon("user");
export const CircleUserRound = makeIcon("circle-user");
export const Users = makeIcon("users");
export const MapPin = makeIcon("map-pin");
export const Building2 = makeIcon("building");
export const Phone = makeIcon("phone");
export const Mail = makeIcon("mail");
export const FileText = makeIcon("file");
export const FileQuestion = makeIcon("file-question");
export const Trash2 = makeIcon("trash");
export const Eye = makeIcon("eye");
export const EyeOff = makeIcon("eye-off");
export const Menu = makeIcon("menu");
export const X = makeIcon("x");
export const Globe = makeIcon("globe");
export const Globe2 = makeIcon("globe");
export const Languages = makeIcon("language");
export const Bell = makeIcon("bell");
export const Shield = makeIcon("shield");
export const ShieldCheck = makeIcon("shield");
export const BadgeCheck = makeIcon("check");
export const KeyRound = makeIcon("key");
export const Grid2X2 = makeIcon("grid");
export const Calculator = makeIcon("calculator");
export const Headset = makeIcon("headset");
export const Send = makeIcon("send");
export const MessageCircle = makeIcon("message");
export const MessageSquareText = makeIcon("message");
export const Sparkles = makeIcon("sparkles");
export const PackageSearch = makeIcon("package");
export const RefreshCw = makeIcon("refresh");
export const RotateCcw = makeIcon("rotate-ccw");
export const Plus = makeIcon("plus");
export const Clock3 = makeIcon("clock");
export const Activity = makeIcon("activity");
export const Info = makeIcon("info");
export const AlertTriangle = makeIcon("alert");
export const ExternalLink = makeIcon("external");
export const LogIn = makeIcon("login");
export const LogOut = makeIcon("logout");
export const FileUp = makeIcon("upload");
export const Download = makeIcon("download");
export const Compass = makeIcon("compass");
export const Save = makeIcon("save");
export const Palette = makeIcon("palette");
export const Type = makeIcon("type");
export const Workflow = makeIcon("workflow");
export const Zap = makeIcon("zap");
export const ClipboardList = makeIcon("clipboard");
export const BookOpenText = makeIcon("book");
export const Boxes = makeIcon("package");
export const Settings = makeIcon("gear");
