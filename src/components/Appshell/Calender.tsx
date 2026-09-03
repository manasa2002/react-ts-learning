import { useEffect, useMemo, useState } from "react";
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Circle,
    CheckCircle2,
    Clock3,
    AlertTriangle,
    FolderKanban,
} from "lucide-react";

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
   HELPERS
===================================================== */

function formatDate(date: Date) {
    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1,
    ).padStart(2, "0");

    const day = String(
        date.getDate(),
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getMonthName(
    date: Date,
) {
    return date.toLocaleDateString(
        "en-US",
        {
            month: "long",
            year: "numeric",
        },
    );
}

/* =====================================================
   MAIN COMPONENT
===================================================== */

function Calendar() {
    /* =====================================================
       DATA
    ===================================================== */

    const [tasks, setTasks] =
        useState<Task[]>([]);

    const [projects, setProjects] =
        useState<Project[]>([]);

    /* =====================================================
       CALENDAR STATE
    ===================================================== */

    const [currentDate, setCurrentDate] =
        useState(new Date());

    const [selectedDate, setSelectedDate] =
        useState(formatDate(new Date()));

    const [projectFilter, setProjectFilter] =
        useState("all");

    /* =====================================================
       LOAD LOCAL STORAGE
    ===================================================== */

    useEffect(() => {
        function loadData() {
            try {
                const savedTasks =
                    localStorage.getItem(
                        "trackly-board-tasks",
                    );

                const savedProjects =
                    localStorage.getItem(
                        "trackly-projects",
                    );

                if (savedTasks) {
                    setTasks(
                        JSON.parse(savedTasks),
                    );
                }

                if (savedProjects) {
                    setProjects(
                        JSON.parse(
                            savedProjects,
                        ),
                    );
                }
            } catch {
                setTasks([]);
                setProjects([]);
            }
        }

        loadData();

        window.addEventListener(
            "storage",
            loadData,
        );

        return () => {
            window.removeEventListener(
                "storage",
                loadData,
            );
        };
    }, []);

    /* =====================================================
       DATE VALUES
    ===================================================== */

    const today = formatDate(
        new Date(),
    );

    const currentYear =
        currentDate.getFullYear();

    const currentMonth =
        currentDate.getMonth();

    const firstDayOfMonth =
        new Date(
            currentYear,
            currentMonth,
            1,
        );

    const daysInMonth =
        new Date(
            currentYear,
            currentMonth + 1,
            0,
        ).getDate();

    const startingDay =
        firstDayOfMonth.getDay();

    /* =====================================================
       FILTER TASKS
    ===================================================== */

    const filteredTasks = useMemo(() => {
        if (
            projectFilter ===
            "all"
        ) {
            return tasks;
        }

        return tasks.filter(
            (task) =>
                task.projectId ===
                projectFilter,
        );
    }, [
        tasks,
        projectFilter,
    ]);

    /* =====================================================
       TASKS BY DATE
    ===================================================== */

    const tasksByDate = useMemo(() => {
        const grouped:
            Record<
                string,
                Task[]
            > = {};

        filteredTasks.forEach(
            (task) => {
                if (!task.dueDate)
                    return;

                if (
                    !grouped[
                    task.dueDate
                    ]
                ) {
                    grouped[
                        task.dueDate
                    ] = [];
                }

                grouped[
                    task.dueDate
                ].push(task);
            },
        );

        return grouped;
    }, [filteredTasks]);

    /* =====================================================
       SELECTED DATE TASKS
    ===================================================== */

    const selectedTasks =
        tasksByDate[
        selectedDate
        ] || [];

    /* =====================================================
       PROJECT NAME
    ===================================================== */

    function getProjectName(
        projectId: string,
    ) {
        const project =
            projects.find(
                (item) =>
                    item.id ===
                    projectId,
            );

        return (
            project?.name ||
            "Unknown Project"
        );
    }

    /* =====================================================
       MONTH NAVIGATION
    ===================================================== */

    function previousMonth() {
        setCurrentDate(
            new Date(
                currentYear,
                currentMonth - 1,
                1,
            ),
        );
    }

    function nextMonth() {
        setCurrentDate(
            new Date(
                currentYear,
                currentMonth + 1,
                1,
            ),
        );
    }

    function goToToday() {
        const now = new Date();

        setCurrentDate(now);

        setSelectedDate(
            formatDate(now),
        );
    }

    /* =====================================================
       CALENDAR DAYS
    ===================================================== */

    const calendarDays =
        useMemo(() => {
            const days: (
                | Date
                | null
            )[] = [];

            for (
                let i = 0;
                i <
                startingDay;
                i++
            ) {
                days.push(null);
            }

            for (
                let day = 1;
                day <=
                daysInMonth;
                day++
            ) {
                days.push(
                    new Date(
                        currentYear,
                        currentMonth,
                        day,
                    ),
                );
            }

            return days;
        }, [
            currentYear,
            currentMonth,
            startingDay,
            daysInMonth,
        ]);

    /* =====================================================
       STATS
    ===================================================== */

    const calendarStats =
        useMemo(() => {
            const active =
                filteredTasks.filter(
                    (task) =>
                        task.status !==
                        "done",
                ).length;

            const completed =
                filteredTasks.filter(
                    (task) =>
                        task.status ===
                        "done",
                ).length;

            const overdue =
                filteredTasks.filter(
                    (task) =>
                        task.status !==
                        "done" &&
                        task.dueDate &&
                        task.dueDate <
                        today,
                ).length;

            const thisMonth =
                filteredTasks.filter(
                    (task) => {
                        if (
                            !task.dueDate
                        )
                            return false;

                        const taskDate =
                            new Date(
                                `${task.dueDate}T00:00:00`,
                            );

                        return (
                            taskDate.getMonth() ===
                            currentMonth &&
                            taskDate.getFullYear() ===
                            currentYear
                        );
                    },
                ).length;

            return {
                active,
                completed,
                overdue,
                thisMonth,
            };
        }, [
            filteredTasks,
            today,
            currentMonth,
            currentYear,
        ]);

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div className="mx-auto max-w-[1400px]">

            {/* HEADER */}

            <section className="mb-8">

                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#849595]">
                    Schedule & Planning
                </p>

                <div className="mt-3 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

                    <div>

                        <h1 className="text-3xl font-semibold tracking-tight text-[#29494a]">
                            Calendar
                        </h1>

                        <p className="mt-2 text-sm text-[#849595]">
                            Plan your work and stay ahead of your deadlines.
                        </p>

                    </div>

                    <div className="flex flex-wrap gap-3">

                        {/* PROJECT FILTER */}

                        <select
                            value={
                                projectFilter
                            }
                            onChange={(
                                event,
                            ) =>
                                setProjectFilter(
                                    event.target
                                        .value,
                                )
                            }
                            className="rounded-xl border border-[#dce4e2] bg-white px-4 py-2.5 text-sm text-[#527273] outline-none transition focus:border-[#527273]"
                        >

                            <option value="all">
                                All Projects
                            </option>

                            {projects.map(
                                (
                                    project,
                                ) => (
                                    <option
                                        key={
                                            project.id
                                        }
                                        value={
                                            project.id
                                        }
                                    >
                                        {
                                            project.name
                                        }
                                    </option>
                                ),
                            )}

                        </select>

                        <button
                            type="button"
                            onClick={
                                goToToday
                            }
                            className="rounded-xl bg-[#214f51] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#183f41]"
                        >
                            Today
                        </button>

                    </div>

                </div>

            </section>

            {/* STATS */}

            <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <CalendarStat
                    icon={
                        <CalendarDays
                            size={19}
                        />
                    }
                    label="Tasks This Month"
                    value={
                        calendarStats.thisMonth
                    }
                />

                <CalendarStat
                    icon={
                        <Clock3
                            size={19}
                        />
                    }
                    label="Active Tasks"
                    value={
                        calendarStats.active
                    }
                />

                <CalendarStat
                    icon={
                        <CheckCircle2
                            size={19}
                        />
                    }
                    label="Completed"
                    value={
                        calendarStats.completed
                    }
                />

                <CalendarStat
                    icon={
                        <AlertTriangle
                            size={19}
                        />
                    }
                    label="Overdue"
                    value={
                        calendarStats.overdue
                    }
                    danger
                />

            </section>

            {/* MAIN CONTENT */}

            <section className="grid gap-6 xl:grid-cols-[1.5fr_0.7fr]">

                {/* CALENDAR */}

                <div className="overflow-hidden rounded-2xl border border-[#e1e7e5] bg-[#f9faf9]">

                    {/* CALENDAR HEADER */}

                    <div className="flex flex-col justify-between gap-4 border-b border-[#e1e7e5] p-5 sm:flex-row sm:items-center">

                        <h2 className="text-lg font-semibold text-[#29494a]">
                            {
                                getMonthName(
                                    currentDate,
                                )
                            }
                        </h2>

                        <div className="flex items-center gap-2">

                            <button
                                type="button"
                                onClick={
                                    previousMonth
                                }
                                className="grid h-9 w-9 place-items-center rounded-lg border border-[#dce4e2] bg-white text-[#527273] transition hover:bg-[#eef2f1]"
                            >
                                <ChevronLeft
                                    size={18}
                                />
                            </button>

                            <button
                                type="button"
                                onClick={
                                    nextMonth
                                }
                                className="grid h-9 w-9 place-items-center rounded-lg border border-[#dce4e2] bg-white text-[#527273] transition hover:bg-[#eef2f1]"
                            >
                                <ChevronRight
                                    size={18}
                                />
                            </button>

                        </div>

                    </div>

                    {/* WEEK DAYS */}

                    <div className="grid grid-cols-7 border-b border-[#e1e7e5]">

                        {[
                            "Sun",
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat",
                        ].map(
                            (
                                day,
                            ) => (
                                <div
                                    key={
                                        day
                                    }
                                    className="border-r border-[#edf1f0] py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-[#8a9b9b] last:border-r-0"
                                >
                                    {day}
                                </div>
                            ),
                        )}

                    </div>

                    {/* DAYS */}

                    <div className="grid grid-cols-7">

                        {calendarDays.map(
                            (
                                date,
                                index,
                            ) => {

                                if (
                                    !date
                                ) {
                                    return (
                                        <div
                                            key={
                                                index
                                            }
                                            className="min-h-[125px] border-b border-r border-[#edf1f0] bg-[#f5f7f6]"
                                        />
                                    );
                                }

                                const dateKey =
                                    formatDate(
                                        date,
                                    );

                                const dayTasks =
                                    tasksByDate[
                                    dateKey
                                    ] ||
                                    [];

                                const isToday =
                                    dateKey ===
                                    today;

                                const isSelected =
                                    dateKey ===
                                    selectedDate;

                                return (
                                    <button
                                        type="button"
                                        key={
                                            dateKey
                                        }
                                        onClick={() =>
                                            setSelectedDate(
                                                dateKey,
                                            )
                                        }
                                        className={`min-h-[125px] border-b border-r border-[#edf1f0] p-2 text-left transition last:border-r-0 hover:bg-[#f3f7f6] ${isSelected
                                            ? "bg-[#edf5f3]"
                                            : "bg-white"
                                            }`}
                                    >

                                        {/* DATE */}

                                        <div className="flex items-center justify-between">

                                            <span
                                                className={`grid h-7 w-7 place-items-center rounded-full text-xs font-medium ${isToday
                                                    ? "bg-[#214f51] text-white"
                                                    : "text-[#527273]"
                                                    }`}
                                            >
                                                {
                                                    date.getDate()
                                                }
                                            </span>

                                            {dayTasks.length >
                                                0 && (
                                                    <span className="text-[9px] text-[#8a9b9b]">
                                                        {
                                                            dayTasks.length
                                                        }
                                                    </span>
                                                )}

                                        </div>

                                        {/* TASKS */}

                                        <div className="mt-2 space-y-1">

                                            {dayTasks
                                                .slice(
                                                    0,
                                                    3,
                                                )
                                                .map(
                                                    (
                                                        task,
                                                    ) => (
                                                        <div
                                                            key={
                                                                task.id
                                                            }
                                                            className={`truncate rounded-md px-2 py-1 text-[9px] font-medium ${task.status ===
                                                                "done"
                                                                ? "bg-[#dceee8] text-[#4c8774]"
                                                                : task.priority ===
                                                                    "high"
                                                                    ? "bg-[#fbe0da] text-[#b85d4c]"
                                                                    : task.priority ===
                                                                        "medium"
                                                                        ? "bg-[#f6edd1] text-[#a9842f]"
                                                                        : "bg-[#e6f0ee] text-[#527273]"
                                                                }`}
                                                        >
                                                            {
                                                                task.title
                                                            }
                                                        </div>
                                                    ),
                                                )}

                                            {dayTasks.length >
                                                3 && (
                                                    <p className="px-1 text-[9px] font-medium text-[#527273]">
                                                        +
                                                        {
                                                            dayTasks.length -
                                                            3
                                                        }{" "}
                                                        more
                                                    </p>
                                                )}

                                        </div>

                                    </button>
                                );
                            },
                        )}

                    </div>

                </div>

                {/* SELECTED DAY */}

                <aside className="rounded-2xl border border-[#e1e7e5] bg-[#f9faf9] p-5">

                    <div className="flex items-start justify-between">

                        <div>

                            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#849595]">
                                Selected Day
                            </p>

                            <h2 className="mt-2 text-lg font-semibold text-[#29494a]">
                                {new Date(
                                    `${selectedDate}T00:00:00`,
                                ).toLocaleDateString(
                                    "en-US",
                                    {
                                        weekday:
                                            "long",
                                        month:
                                            "long",
                                        day:
                                            "numeric",
                                    },
                                )}
                            </h2>

                        </div>

                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#e6f0ee] text-[#315b5d]">

                            <CalendarDays
                                size={19}
                            />

                        </div>

                    </div>

                    {/* TASK LIST */}

                    <div className="mt-7">

                        {selectedTasks.length ===
                            0 ? (
                            <div className="rounded-xl border border-dashed border-[#d6dfdc] bg-white px-4 py-10 text-center">

                                <CalendarDays
                                    size={22}
                                    className="mx-auto text-[#a7b3b3]"
                                />

                                <p className="mt-3 text-sm font-medium text-[#527273]">
                                    No tasks scheduled
                                </p>

                                <p className="mt-1 text-xs text-[#8a9b9b]">
                                    Enjoy your free day.
                                </p>

                            </div>
                        ) : (
                            <div className="space-y-3">

                                {selectedTasks.map(
                                    (
                                        task,
                                    ) => (
                                        <CalendarTask
                                            key={
                                                task.id
                                            }
                                            task={
                                                task
                                            }
                                            projectName={getProjectName(
                                                task.projectId,
                                            )}
                                        />
                                    ),
                                )}

                            </div>
                        )}

                    </div>

                </aside>

            </section>

            {/* CALENDAR LEGEND */}

            <section className="mt-6 flex flex-wrap gap-4 rounded-2xl border border-[#e1e7e5] bg-[#f9faf9] p-4">

                <LegendItem
                    color="bg-[#fbe0da]"
                    label="High Priority"
                />

                <LegendItem
                    color="bg-[#f6edd1]"
                    label="Medium Priority"
                />

                <LegendItem
                    color="bg-[#e6f0ee]"
                    label="Low Priority"
                />

                <LegendItem
                    color="bg-[#dceee8]"
                    label="Completed"
                />

            </section>

        </div>
    );
}

/* =====================================================
   STAT CARD
===================================================== */

function CalendarStat({
    icon,
    label,
    value,
    danger = false,
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
    danger?: boolean;
}) {
    return (
        <div className="rounded-2xl border border-[#e1e7e5] bg-[#f9faf9] p-5">

            <div className="flex items-center justify-between">

                <div
                    className={`grid h-10 w-10 place-items-center rounded-xl ${danger
                        ? "bg-[#fde8e4] text-[#c65b50]"
                        : "bg-[#e6f0ee] text-[#315b5d]"
                        }`}
                >
                    {icon}
                </div>

                <p
                    className={`text-2xl font-semibold ${danger
                        ? "text-[#c65b50]"
                        : "text-[#29494a]"
                        }`}
                >
                    {value}
                </p>

            </div>

            <p className="mt-4 text-sm text-[#849595]">
                {label}
            </p>

        </div>
    );
}

/* =====================================================
   CALENDAR TASK
===================================================== */

function CalendarTask({
    task,
    projectName,
}: {
    task: Task;
    projectName: string;
}) {
    const priorityStyles = {
        high:
            "bg-[#fbe0da] text-[#b85d4c]",
        medium:
            "bg-[#f6edd1] text-[#a9842f]",
        low:
            "bg-[#e6f0ee] text-[#527273]",
    };

    return (
        <div className="rounded-xl border border-[#e1e7e5] bg-white p-4">

            <div className="flex items-start justify-between gap-3">

                <div className="min-w-0 flex-1">

                    <div className="flex items-center gap-2">

                        {task.status ===
                            "done" ? (
                            <CheckCircle2
                                size={16}
                                className="text-[#4c8774]"
                            />
                        ) : (
                            <Circle
                                size={16}
                                className="text-[#aebbbb]"
                            />
                        )}

                        <h3
                            className={`truncate text-sm font-medium ${task.status ===
                                "done"
                                ? "text-[#a2afad] line-through"
                                : "text-[#29494a]"
                                }`}
                        >
                            {task.title}
                        </h3>

                    </div>

                    {task.description && (
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#849595]">
                            {
                                task.description
                            }
                        </p>
                    )}

                </div>

                <span
                    className={`rounded-md px-2 py-1 text-[9px] font-medium capitalize ${priorityStyles[
                        task.priority
                    ]
                        }`}
                >
                    {task.priority}
                </span>

            </div>

            <div className="mt-4 flex items-center justify-between border-t border-[#edf1f0] pt-3">

                <div className="flex items-center gap-1.5 text-[10px] text-[#849595]">

                    <FolderKanban
                        size={13}
                    />

                    {projectName}

                </div>

                {task.assignee && (
                    <span className="rounded-full bg-[#e6f0ee] px-2 py-1 text-[9px] font-medium text-[#527273]">
                        {task.assignee}
                    </span>
                )}

            </div>

        </div>
    );
}

/* =====================================================
   LEGEND
===================================================== */

function LegendItem({
    color,
    label,
}: {
    color: string;
    label: string;
}) {
    return (
        <div className="flex items-center gap-2">

            <span
                className={`h-3 w-3 rounded-full ${color}`}
            />

            <span className="text-xs text-[#718282]">
                {label}
            </span>

        </div>
    );
}

export default Calendar;