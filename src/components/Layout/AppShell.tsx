import { useState, type ReactNode } from "react";
import { NavLink, Outlet } from "react-router-dom";

import {
    BarChart3,
    CalendarDays,
    CheckSquare,
    ChevronLeft,
    ChevronRight,
    FolderKanban,
    House,
    Menu,
    Search,
    Settings,
    Users,
    X,
} from "lucide-react";

interface NavigationItem {
    name: string;
    path: string;
    icon: ReactNode;
}

const navigationItems: NavigationItem[] = [
    {
        name: "Dashboard",
        path: "/dashboard",
        icon: <House size={19} />,
    },
    {
        name: "Projects",
        path: "/projects",
        icon: <FolderKanban size={19} />,
    },
    {
        name: "My Tasks",
        path: "/tasks",
        icon: <CheckSquare size={19} />,
    },
    {
        name: "Calendar",
        path: "/calendar",
        icon: <CalendarDays size={19} />,
    },
    {
        name: "Team",
        path: "/team",
        icon: <Users size={19} />,
    },
    {
        name: "Analytics",
        path: "/analytics",
        icon: <BarChart3 size={19} />,
    },
];

function AppShell() {
    const [isCollapsed, setIsCollapsed] =
        useState(false);

    const [isMobileOpen, setIsMobileOpen] =
        useState(false);

    return (
        <div className="min-h-screen bg-[#f3f5f4]">
            {/* MOBILE OVERLAY */}

            {isMobileOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={() => setIsMobileOpen(false)}
                    className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden"
                />
            )}

            {/* SIDEBAR */}

            <aside
                className={`
          fixed inset-y-0 left-0 z-40
          flex flex-col
          bg-[#173f40]
          transition-all duration-300

          ${isCollapsed ? "w-[78px]" : "w-[240px]"}

          ${isMobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                    }
        `}
            >
                {/* LOGO */}

                <div
                    className={`
            flex h-[76px] items-center
            border-b border-white/10
            px-4

            ${isCollapsed
                            ? "justify-center"
                            : "justify-between"
                        }
          `}
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#315b5d] text-sm font-bold text-white">
                            T
                        </div>

                        {!isCollapsed && (
                            <div>
                                <h1 className="text-sm font-semibold text-white">
                                    Trackly
                                </h1>

                                <p className="text-[10px] text-[#9db6b5]">
                                    Workspace
                                </p>
                            </div>
                        )}
                    </div>

                    {/* DESKTOP TOGGLE */}

                    {!isCollapsed && (
                        <button
                            type="button"
                            onClick={() =>
                                setIsCollapsed(true)
                            }
                            className="hidden text-[#a8c1c1] transition hover:text-white lg:block"
                        >
                            <ChevronLeft size={18} />
                        </button>
                    )}

                    {/* MOBILE CLOSE */}

                    <button
                        type="button"
                        onClick={() =>
                            setIsMobileOpen(false)
                        }
                        className="text-[#a8c1c1] lg:hidden"
                    >
                        <X size={19} />
                    </button>
                </div>

                {/* EXPAND BUTTON */}

                {isCollapsed && (
                    <button
                        type="button"
                        onClick={() =>
                            setIsCollapsed(false)
                        }
                        className="hidden h-[50px] items-center justify-center border-b border-white/10 text-[#a8c1c1] transition hover:text-white lg:flex"
                    >
                        <ChevronRight size={18} />
                    </button>
                )}

                {/* WORKSPACE INFO */}

                {!isCollapsed && (
                    <div className="px-4 py-5">
                        <div className="rounded-xl bg-white/5 p-3">
                            <p className="text-[10px] font-medium uppercase tracking-wider text-[#86a6a5]">
                                Current Project
                            </p>

                            <div className="mt-3 flex items-center gap-3">
                                <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#ef8b7a] text-xs font-bold text-white">
                                    W
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-xs font-semibold text-white">
                                        Website Redesign
                                    </p>

                                    <p className="mt-0.5 text-[10px] text-[#91adac]">
                                        12 tasks active
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* NAVIGATION */}

                <nav className="flex-1 px-3">
                    <p
                        className={`
              mb-3 px-2 text-[10px]
              font-semibold uppercase
              tracking-wider text-[#7f9d9d]

              ${isCollapsed ? "hidden" : ""}
            `}
                    >
                        Workspace
                    </p>

                    <div className="space-y-1">
                        {navigationItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                title={
                                    isCollapsed
                                        ? item.name
                                        : undefined
                                }
                                onClick={() =>
                                    setIsMobileOpen(false)
                                }
                                className={({ isActive }) =>
                                    `
                    flex h-11 items-center
                    rounded-xl
                    transition-all duration-200

                    ${isCollapsed
                                        ? "justify-center"
                                        : "gap-3 px-3"
                                    }

                    ${isActive
                                        ? "bg-[#315b5d] text-white"
                                        : "text-[#a7c0bf] hover:bg-white/5 hover:text-white"
                                    }
                  `
                                }
                            >
                                {item.icon}

                                {!isCollapsed && (
                                    <span className="text-sm font-medium">
                                        {item.name}
                                    </span>
                                )}
                            </NavLink>
                        ))}
                    </div>
                </nav>

                {/* SETTINGS */}

                <div className="border-t border-white/10 p-3">
                    <NavLink
                        to="/settings"
                        title={
                            isCollapsed
                                ? "Settings"
                                : undefined
                        }
                        className={({ isActive }) =>
                            `
                flex h-11 items-center rounded-xl
                transition

                ${isCollapsed
                                ? "justify-center"
                                : "gap-3 px-3"
                            }

                ${isActive
                                ? "bg-[#315b5d] text-white"
                                : "text-[#a7c0bf] hover:bg-white/5 hover:text-white"
                            }
              `
                        }
                    >
                        <Settings size={19} />

                        {!isCollapsed && (
                            <span className="text-sm font-medium">
                                Settings
                            </span>
                        )}
                    </NavLink>
                </div>
            </aside>

            {/* MAIN CONTENT */}

            <div
                className={`
          min-h-screen transition-all duration-300

          ${isCollapsed
                        ? "lg:ml-[78px]"
                        : "lg:ml-[240px]"
                    }
        `}
            >
                {/* HEADER */}

                <header className="flex h-[76px] items-center justify-between border-b border-[#e2e7e5] bg-[#f8f9f8] px-5 lg:px-7">
                    <div className="flex items-center gap-4">
                        {/* MOBILE MENU */}

                        <button
                            type="button"
                            onClick={() =>
                                setIsMobileOpen(true)
                            }
                            className="grid h-9 w-9 place-items-center rounded-lg border border-[#dfe5e3] bg-white text-[#29494a] lg:hidden"
                        >
                            <Menu size={19} />
                        </button>

                        {/* PAGE TITLE */}

                        <div>
                            <p className="text-xs text-[#8a9b9b]">
                                Trackly Workspace
                            </p>

                            <h2 className="text-sm font-semibold text-[#29494a]">
                                Website Redesign
                            </h2>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}

                    <div className="flex items-center gap-3">
                        {/* SEARCH */}

                        <div className="hidden items-center gap-2 rounded-lg border border-[#dfe5e3] bg-white px-3 py-2 lg:flex">
                            <Search
                                size={16}
                                className="text-[#9aa8a8]"
                            />

                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-[150px] bg-transparent text-xs outline-none placeholder:text-[#a7b3b3]"
                            />
                        </div>

                        {/* TEAM */}

                        <div className="flex items-center">
                            {["M", "A", "R"].map(
                                (member, index) => (
                                    <div
                                        key={member}
                                        className={`
                      grid h-8 w-8
                      place-items-center
                      rounded-full
                      border-2 border-[#f8f9f8]
                      bg-[#dbe9e7]
                      text-[10px]
                      font-semibold
                      text-[#527273]

                      ${index > 0
                                                ? "-ml-2"
                                                : ""
                                            }
                    `}
                                    >
                                        {member}
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                </header>

                {/* ROUTE CONTENT */}

                <main className="p-5 lg:p-7">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AppShell;