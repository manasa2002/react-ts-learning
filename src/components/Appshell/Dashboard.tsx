import { useEffect, useMemo, useState } from "react";
import {
    ArrowUpRight,
    CheckCircle2,
    Clock3,
    FolderKanban,
    MoreHorizontal,
    Plus,
    Users,
    CalendarDays,
    ListTodo,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* =====================================================
   TYPES
===================================================== */

type TaskStatus = "todo" | "progress" | "done";

type TaskPriority = "low" | "medium" | "high";

interface Task {
    id: string;
    projectId: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    assignee: string;
    dueDate: string;
    order: number;
}

interface Project {
    id: string;
    name: string;
    description?: string;
    status?: string;
    progress?: number;
    dueDate?: string;
    members?: string[];
    taskCount?: number;
}

/* =====================================================
   MAIN COMPONENT
===================================================== */

function Dashboard() {
    const navigate = useNavigate();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);

    /* =====================================================
       LOAD DATA
    ===================================================== */

    useEffect(() => {
        function loadDashboardData() {
            const savedTasks = localStorage.getItem(
                "trackly-board-tasks",
            );

            const savedProjects = localStorage.getItem(
                "trackly-projects",
            );

            if (savedTasks) {
                try {
                    setTasks(JSON.parse(savedTasks));
                } catch {
                    setTasks([]);
                }
            } else {
                setTasks([]);
            }

            if (savedProjects) {
                try {
                    setProjects(JSON.parse(savedProjects));
                } catch {
                    setProjects([]);
                }
            } else {
                setProjects([]);
            }
        }

        loadDashboardData();

        window.addEventListener(
            "focus",
            loadDashboardData,
        );

        return () => {
            window.removeEventListener(
                "focus",
                loadDashboardData,
            );
        };
    }, []);

    /* =====================================================
       DATE
    ===================================================== */

    const today = useMemo(() => {
        const currentDate = new Date();

        const year = currentDate.getFullYear();

        const month = String(
            currentDate.getMonth() + 1,
        ).padStart(2, "0");

        const day = String(
            currentDate.getDate(),
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }, []);

    /* =====================================================
       PROJECT NAME
    ===================================================== */

    function getProjectName(projectId: string) {
        return (
            projects.find(
                (project) =>
                    project.id === projectId,
            )?.name || "Unknown Project"
        );
    }

    /* =====================================================
       STATISTICS
    ===================================================== */

    const statistics = useMemo(() => {
        const activeProjects =
            projects.filter(
                (project) =>
                    project.status !== "completed",
            ).length;

        const inProgress =
            tasks.filter(
                (task) =>
                    task.status === "progress",
            ).length;

        const completed =
            tasks.filter(
                (task) =>
                    task.status === "done",
            ).length;

        const members = new Set(
            tasks
                .map(
                    (task) =>
                        task.assignee,
                )
                .filter(Boolean),
        ).size;

        return {
            activeProjects,
            inProgress,
            completed,
            members,
        };
    }, [projects, tasks]);

    /* =====================================================
       PROJECT PROGRESS
    ===================================================== */

    const projectProgress = useMemo(() => {
        return projects
            .map((project) => {
                const projectTasks =
                    tasks.filter(
                        (task) =>
                            task.projectId ===
                            project.id,
                    );

                const completedTasks =
                    projectTasks.filter(
                        (task) =>
                            task.status === "done",
                    ).length;

                const totalTasks =
                    projectTasks.length;

                const calculatedProgress =
                    totalTasks === 0
                        ? 0
                        : Math.round(
                            (completedTasks /
                                totalTasks) *
                            100,
                        );

                return {
                    id: project.id,
                    name: project.name,
                    progress:
                        project.progress ??
                        calculatedProgress,
                    completedTasks,
                    totalTasks,
                };
            })
            .sort(
                (a, b) =>
                    b.progress -
                    a.progress,
            )
            .slice(0, 4);
    }, [projects, tasks]);

    /* =====================================================
       UPCOMING TASKS
    ===================================================== */

    const upcomingTasks = useMemo(() => {
        return tasks
            .filter(
                (task) =>
                    task.status !== "done" &&
                    task.dueDate,
            )
            .sort(
                (a, b) =>
                    a.dueDate.localeCompare(
                        b.dueDate,
                    ),
            )
            .slice(0, 5);
    }, [tasks]);

    /* =====================================================
       WORKSPACE PROGRESS
    ===================================================== */

    const workspaceProgress = useMemo(() => {
        if (tasks.length === 0) {
            return 0;
        }

        const completed =
            tasks.filter(
                (task) =>
                    task.status === "done",
            ).length;

        return Math.round(
            (completed / tasks.length) *
            100,
        );
    }, [tasks]);

    /* =====================================================
       FORMAT DATE
    ===================================================== */

    function formatTaskDate(
        dueDate: string,
    ) {
        if (!dueDate) {
            return "No date";
        }

        if (dueDate === today) {
            return "Today";
        }

        const tomorrow = new Date();

        tomorrow.setDate(
            tomorrow.getDate() + 1,
        );

        const tomorrowDate =
            tomorrow
                .toISOString()
                .split("T")[0];

        if (dueDate === tomorrowDate) {
            return "Tomorrow";
        }

        return new Date(
            `${dueDate}T00:00:00`,
        ).toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
            },
        );
    }

    /* =====================================================
       RECENT ACTIVITY
    ===================================================== */

    const recentActivity = useMemo(() => {
        const completedTasks =
            tasks
                .filter(
                    (task) =>
                        task.status ===
                        "done",
                )
                .slice(-3)
                .reverse();

        return completedTasks.map(
            (task) => ({
                user:
                    task.assignee ||
                    "You",
                action: "completed",
                task: task.title,
            }),
        );
    }, [tasks]);

    return (
        <div className="mx-auto max-w-[1400px]">

            {/* PAGE HEADER */}

            <section className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

                <div>
                    <p className="text-xs font-medium text-[#789090]">
                        {new Date().toLocaleDateString(
                            "en-US",
                            {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                            },
                        )}
                    </p>

                    <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#29494a]">
                        Good morning 👋
                    </h1>

                    <p className="mt-2 text-sm text-[#849595]">
                        Here's what's happening in your workspace.
                    </p>
                </div>

                <button
                    onClick={() =>
                        navigate("/projects")
                    }
                    className="flex items-center justify-center gap-2 rounded-lg bg-[#214f51] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#183f41]"
                >
                    <Plus size={16} />
                    New project
                </button>

            </section>

            {/* STATS */}

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    title="Active Projects"
                    value={String(
                        statistics.activeProjects,
                    ).padStart(2, "0")}
                    change={`${projects.length} total projects`}
                    icon={
                        <FolderKanban
                            size={19}
                        />
                    }
                />

                <StatCard
                    title="Tasks In Progress"
                    value={String(
                        statistics.inProgress,
                    ).padStart(2, "0")}
                    change="Currently active"
                    icon={
                        <Clock3
                            size={19}
                        />
                    }
                />

                <StatCard
                    title="Completed"
                    value={String(
                        statistics.completed,
                    ).padStart(2, "0")}
                    change={`${workspaceProgress}% workspace progress`}
                    icon={
                        <CheckCircle2
                            size={19}
                        />
                    }
                />

                <StatCard
                    title="Team Members"
                    value={String(
                        statistics.members,
                    ).padStart(2, "0")}
                    change="Assigned to tasks"
                    icon={
                        <Users
                            size={19}
                        />
                    }
                />

            </section>

            {/* MAIN GRID */}

            <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">

                {/* PROJECT PROGRESS */}

                <div className="rounded-2xl border border-[#e1e7e5] bg-[#f9faf9] p-5">

                    <div className="flex items-center justify-between">

                        <div>
                            <h2 className="text-sm font-semibold text-[#29494a]">
                                Project Progress
                            </h2>

                            <p className="mt-1 text-xs text-[#8a9b9b]">
                                Your active projects
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                navigate("/projects")
                            }
                            className="text-[#8a9b9b] transition hover:text-[#29494a]"
                        >
                            <MoreHorizontal
                                size={20}
                            />
                        </button>

                    </div>

                    <div className="mt-6 space-y-5">

                        {projectProgress.length ===
                            0 ? (
                            <EmptyState
                                icon={
                                    <FolderKanban
                                        size={20}
                                    />
                                }
                                title="No projects yet"
                                description="Create your first project to start tracking progress."
                                action={() =>
                                    navigate(
                                        "/projects",
                                    )
                                }
                                actionLabel="Create Project"
                            />
                        ) : (
                            projectProgress.map(
                                (
                                    project,
                                ) => (
                                    <ProjectProgress
                                        key={
                                            project.id
                                        }
                                        name={
                                            project.name
                                        }
                                        progress={
                                            project.progress
                                        }
                                        tasks={`${project.completedTasks} / ${project.totalTasks} tasks completed`}
                                    />
                                ),
                            )
                        )}

                    </div>

                </div>

                {/* UPCOMING TASKS */}

                <div className="rounded-2xl border border-[#e1e7e5] bg-[#f9faf9] p-5">

                    <div className="flex items-center justify-between">

                        <div>
                            <h2 className="text-sm font-semibold text-[#29494a]">
                                Upcoming Tasks
                            </h2>

                            <p className="mt-1 text-xs text-[#8a9b9b]">
                                Don't miss your deadlines
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                navigate(
                                    "/my-tasks",
                                )
                            }
                            className="text-xs font-medium text-[#315b5d]"
                        >
                            View all
                        </button>

                    </div>

                    <div className="mt-5 space-y-3">

                        {upcomingTasks.length ===
                            0 ? (
                            <EmptyState
                                icon={
                                    <CalendarDays
                                        size={20}
                                    />
                                }
                                title="No upcoming tasks"
                                description="You're all caught up."
                                action={() =>
                                    navigate(
                                        "/my-tasks",
                                    )
                                }
                                actionLabel="View Tasks"
                            />
                        ) : (
                            upcomingTasks.map(
                                (task) => (
                                    <div
                                        key={
                                            task.id
                                        }
                                        className="flex items-center justify-between gap-3 rounded-xl border border-[#e5eae9] bg-white p-3"
                                    >

                                        <div className="min-w-0">

                                            <p className="truncate text-xs font-medium text-[#29494a]">
                                                {
                                                    task.title
                                                }
                                            </p>

                                            <p className="mt-1 truncate text-[10px] text-[#8a9b9b]">
                                                {getProjectName(
                                                    task.projectId,
                                                )}
                                            </p>

                                        </div>

                                        <span className="flex-shrink-0 rounded-md bg-[#edf3f1] px-2 py-1 text-[10px] font-medium text-[#527273]">
                                            {formatTaskDate(
                                                task.dueDate,
                                            )}
                                        </span>

                                    </div>
                                ),
                            )
                        )}

                    </div>

                </div>

            </section>

            {/* LOWER SECTION */}

            <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">

                {/* RECENT ACTIVITY */}

                <div className="rounded-2xl border border-[#e1e7e5] bg-[#f9faf9] p-5">

                    <h2 className="text-sm font-semibold text-[#29494a]">
                        Recent Activity
                    </h2>

                    <div className="mt-5 space-y-5">

                        {recentActivity.length ===
                            0 ? (
                            <div className="flex flex-col items-center justify-center py-6 text-center">

                                <ListTodo
                                    size={22}
                                    className="text-[#8a9b9b]"
                                />

                                <p className="mt-3 text-xs text-[#849595]">
                                    Activity will appear as you complete tasks.
                                </p>

                            </div>
                        ) : (
                            recentActivity.map(
                                (
                                    activity,
                                ) => (
                                    <div
                                        key={
                                            activity.task
                                        }
                                        className="flex items-center gap-3"
                                    >

                                        <div className="grid h-8 w-8 place-items-center rounded-full bg-[#dcebea] text-[10px] font-semibold text-[#527273]">

                                            {activity.user
                                                .charAt(
                                                    0,
                                                )
                                                .toUpperCase()}

                                        </div>

                                        <p className="text-xs text-[#718282]">

                                            <span className="font-semibold text-[#29494a]">
                                                {
                                                    activity.user
                                                }
                                            </span>{" "}

                                            {
                                                activity.action
                                            }{" "}

                                            <span className="font-medium text-[#315b5d]">
                                                {
                                                    activity.task
                                                }
                                            </span>

                                        </p>

                                    </div>
                                ),
                            )
                        )}

                    </div>

                </div>

                {/* WORKSPACE HEALTH */}

                <div className="rounded-2xl bg-[#214f51] p-5 text-white">

                    <p className="text-xs text-[#b8d3d0]">
                        WORKSPACE PROGRESS
                    </p>

                    <h2 className="mt-3 text-xl font-semibold">
                        {workspaceProgress === 100
                            ? "Amazing work! Everything is complete."
                            : "You're making great progress."}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#b9d1cf]">

                        {tasks.length === 0
                            ? "Create projects and tasks to start tracking your workspace progress."
                            : `${workspaceProgress}% of your workspace tasks are completed.`}

                    </p>

                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20">

                        <div
                            className="h-full rounded-full bg-white transition-all duration-500"
                            style={{
                                width: `${workspaceProgress}%`,
                            }}
                        />

                    </div>

                    <button
                        onClick={() =>
                            navigate("/my-tasks")
                        }
                        className="mt-5 flex items-center gap-2 text-sm font-medium text-white"
                    >
                        View my tasks

                        <ArrowUpRight
                            size={16}
                        />

                    </button>

                </div>

            </section>

        </div>
    );
}

/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
    title,
    value,
    change,
    icon,
}: {
    title: string;
    value: string;
    change: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-[#e1e7e5] bg-[#f9faf9] p-5 transition hover:-translate-y-0.5 hover:shadow-sm">

            <div className="flex items-center justify-between">

                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#e6f0ee] text-[#315b5d]">
                    {icon}
                </div>

                <span className="text-xs font-medium text-[#6d8f89]">
                    ↗
                </span>

            </div>

            <p className="mt-5 text-xs text-[#849595]">
                {title}
            </p>

            <p className="mt-1 text-2xl font-semibold text-[#29494a]">
                {value}
            </p>

            <p className="mt-2 text-[10px] text-[#8a9b9b]">
                {change}
            </p>

        </div>
    );
}

/* =====================================================
   PROJECT PROGRESS
===================================================== */

function ProjectProgress({
    name,
    progress,
    tasks,
}: {
    name: string;
    progress: number;
    tasks: string;
}) {
    return (
        <div>

            <div className="flex items-center justify-between gap-4">

                <div className="min-w-0">

                    <p className="truncate text-xs font-medium text-[#29494a]">
                        {name}
                    </p>

                    <p className="mt-1 text-[10px] text-[#8a9b9b]">
                        {tasks}
                    </p>

                </div>

                <span className="text-xs font-semibold text-[#315b5d]">
                    {progress}%
                </span>

            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e5ecea]">

                <div
                    className="h-full rounded-full bg-[#315b5d] transition-all duration-500"
                    style={{
                        width: `${progress}%`,
                    }}
                />

            </div>

        </div>
    );
}

/* =====================================================
   EMPTY STATE
===================================================== */

function EmptyState({
    icon,
    title,
    description,
    action,
    actionLabel,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    action: () => void;
    actionLabel: string;
}) {
    return (
        <div className="rounded-xl border border-dashed border-[#d6dfdc] bg-white px-4 py-8 text-center">

            <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-[#e6f0ee] text-[#315b5d]">
                {icon}
            </div>

            <h3 className="mt-3 text-sm font-semibold text-[#29494a]">
                {title}
            </h3>

            <p className="mt-1 text-xs leading-5 text-[#849595]">
                {description}
            </p>

            <button
                type="button"
                onClick={action}
                className="mt-4 text-xs font-medium text-[#315b5d] transition hover:text-[#214f51]"
            >
                {actionLabel}
            </button>

        </div>
    );
}

export default Dashboard;