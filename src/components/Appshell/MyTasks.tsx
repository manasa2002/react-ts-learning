import { useEffect, useMemo, useState } from "react";
import {
    AlertTriangle,
    CalendarDays,
    CheckCircle2,
    Circle,
    Clock3,
    Edit3,
    ListTodo,
    RotateCcw,
    Search,
    Trash2,
    X,
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
   MAIN COMPONENT
===================================================== */

function MyTasks() {
    /* =====================================================
       TASK DATA
    ===================================================== */

    const [tasks, setTasks] = useState<Task[]>(() => {
        const savedTasks = localStorage.getItem(
            "trackly-board-tasks",
        );

        if (savedTasks) {
            try {
                return JSON.parse(savedTasks);
            } catch {
                return [];
            }
        }

        return [];
    });

    /* =====================================================
       PROJECT DATA
    ===================================================== */

    const [projects] = useState<Project[]>(() => {
        const savedProjects = localStorage.getItem(
            "trackly-projects",
        );

        if (savedProjects) {
            try {
                return JSON.parse(savedProjects);
            } catch {
                return [];
            }
        }

        return [];
    });

    /* =====================================================
       FILTER STATES
    ===================================================== */

    const [searchQuery, setSearchQuery] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState<"all" | TaskStatus>("all");

    const [priorityFilter, setPriorityFilter] =
        useState<"all" | TaskPriority>("all");

    const [projectFilter, setProjectFilter] =
        useState("all");

    /* =====================================================
       MODAL STATES
    ===================================================== */

    const [selectedTask, setSelectedTask] =
        useState<Task | null>(null);

    const [editingTask, setEditingTask] =
        useState<Task | null>(null);

    /* =====================================================
       EDIT FORM STATE
    ===================================================== */

    const [taskTitle, setTaskTitle] =
        useState("");

    const [taskDescription, setTaskDescription] =
        useState("");

    const [taskStatus, setTaskStatus] =
        useState<TaskStatus>("todo");

    const [taskPriority, setTaskPriority] =
        useState<TaskPriority>("medium");

    const [taskDueDate, setTaskDueDate] =
        useState("");

    const [taskAssignee, setTaskAssignee] =
        useState("");

    /* =====================================================
       SAVE TASKS
    ===================================================== */

    useEffect(() => {
        localStorage.setItem(
            "trackly-board-tasks",
            JSON.stringify(tasks),
        );
    }, [tasks]);

    /* =====================================================
       DATE HELPERS
    ===================================================== */

    const getTodayDate = () => {
        const today = new Date();

        const year = today.getFullYear();

        const month = String(
            today.getMonth() + 1,
        ).padStart(2, "0");

        const day = String(
            today.getDate(),
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const today = getTodayDate();

    /* =====================================================
       PROJECT HELPERS
    ===================================================== */

    function getProjectName(
        projectId: string,
    ) {
        const project = projects.find(
            (item) =>
                item.id === projectId,
        );

        return (
            project?.name ||
            "Unknown Project"
        );
    }

    /* =====================================================
       FILTERED TASKS
    ===================================================== */

    const filteredTasks = useMemo(() => {
        const search =
            searchQuery.toLowerCase().trim();

        return tasks.filter((task) => {
            const projectName =
                getProjectName(
                    task.projectId,
                ).toLowerCase();

            const searchMatches =
                !search ||
                task.title
                    .toLowerCase()
                    .includes(search) ||
                task.description
                    .toLowerCase()
                    .includes(search) ||
                task.assignee
                    .toLowerCase()
                    .includes(search) ||
                projectName.includes(search);

            const statusMatches =
                statusFilter === "all" ||
                task.status === statusFilter;

            const priorityMatches =
                priorityFilter === "all" ||
                task.priority ===
                priorityFilter;

            const projectMatches =
                projectFilter === "all" ||
                task.projectId ===
                projectFilter;

            return (
                searchMatches &&
                statusMatches &&
                priorityMatches &&
                projectMatches
            );
        });
    }, [
        tasks,
        searchQuery,
        statusFilter,
        priorityFilter,
        projectFilter,
        projects,
    ]);

    /* =====================================================
       TASK GROUPS
    ===================================================== */

    const overdueTasks = useMemo(() => {
        return filteredTasks.filter(
            (task) =>
                task.status !== "done" &&
                task.dueDate &&
                task.dueDate < today,
        );
    }, [
        filteredTasks,
        today,
    ]);

    const todayTasks = useMemo(() => {
        return filteredTasks.filter(
            (task) =>
                task.status !== "done" &&
                task.dueDate === today,
        );
    }, [
        filteredTasks,
        today,
    ]);

    const upcomingTasks = useMemo(() => {
        return filteredTasks
            .filter(
                (task) =>
                    task.status !== "done" &&
                    task.dueDate &&
                    task.dueDate > today,
            )
            .sort(
                (a, b) =>
                    a.dueDate.localeCompare(
                        b.dueDate,
                    ),
            );
    }, [
        filteredTasks,
        today,
    ]);

    const noDueDateTasks = useMemo(() => {
        return filteredTasks.filter(
            (task) =>
                task.status !== "done" &&
                !task.dueDate,
        );
    }, [filteredTasks]);

    const completedTasks = useMemo(() => {
        return filteredTasks.filter(
            (task) =>
                task.status === "done",
        );
    }, [filteredTasks]);

    /* =====================================================
       STATISTICS
    ===================================================== */

    const statistics = useMemo(() => {
        const total =
            tasks.length;

        const completed =
            tasks.filter(
                (task) =>
                    task.status === "done",
            ).length;

        const inProgress =
            tasks.filter(
                (task) =>
                    task.status ===
                    "progress",
            ).length;

        const overdue =
            tasks.filter(
                (task) =>
                    task.status !==
                    "done" &&
                    task.dueDate &&
                    task.dueDate < today,
            ).length;

        return {
            total,
            completed,
            inProgress,
            overdue,
        };
    }, [
        tasks,
        today,
    ]);

    /* =====================================================
       FILTERS
    ===================================================== */

    function clearFilters() {
        setSearchQuery("");
        setStatusFilter("all");
        setPriorityFilter("all");
        setProjectFilter("all");
    }

    const hasActiveFilters =
        searchQuery.trim() !== "" ||
        statusFilter !== "all" ||
        priorityFilter !== "all" ||
        projectFilter !== "all";

    /* =====================================================
       NORMALIZE ORDERS
    ===================================================== */

    function normalizeTaskOrders(
        updatedTasks: Task[],
    ) {
        const result = [...updatedTasks];

        const statuses: TaskStatus[] = [
            "todo",
            "progress",
            "done",
        ];

        statuses.forEach(
            (status) => {
                const projectIds =
                    Array.from(
                        new Set(
                            result.map(
                                (task) =>
                                    task.projectId,
                            ),
                        ),
                    );

                projectIds.forEach(
                    (projectId) => {
                        const matchingTasks =
                            result
                                .filter(
                                    (task) =>
                                        task.projectId ===
                                        projectId &&
                                        task.status ===
                                        status,
                                )
                                .sort(
                                    (
                                        a,
                                        b,
                                    ) =>
                                        a.order -
                                        b.order,
                                );

                        matchingTasks.forEach(
                            (
                                task,
                                index,
                            ) => {
                                const taskIndex =
                                    result.findIndex(
                                        (
                                            item,
                                        ) =>
                                            item.id ===
                                            task.id,
                                    );

                                if (
                                    taskIndex !==
                                    -1
                                ) {
                                    result[
                                        taskIndex
                                    ] = {
                                        ...result[
                                        taskIndex
                                        ],
                                        order: index,
                                    };
                                }
                            },
                        );
                    },
                );
            },
        );

        return result;
    }

    /* =====================================================
       COMPLETE TASK
    ===================================================== */

    function toggleTaskCompletion(
        taskId: string,
    ) {
        setTasks(
            (previousTasks) => {
                const updatedTasks =
                    previousTasks.map(
                        (task) =>
                            task.id ===
                                taskId
                                ? {
                                    ...task,
                                    status:
                                        task.status ===
                                            "done"
                                            ? "todo"
                                            : "done",
                                }
                                : task,
                    );

                return normalizeTaskOrders(
                    updatedTasks,
                );
            },
        );

        setSelectedTask(
            (previous) =>
                previous &&
                    previous.id === taskId
                    ? {
                        ...previous,
                        status:
                            previous.status ===
                                "done"
                                ? "todo"
                                : "done",
                    }
                    : previous,
        );
    }

    /* =====================================================
       DELETE TASK
    ===================================================== */

    function deleteTask(
        taskId: string,
    ) {
        const shouldDelete =
            window.confirm(
                "Are you sure you want to delete this task?",
            );

        if (!shouldDelete) return;

        setTasks(
            (previousTasks) => {
                const updatedTasks =
                    previousTasks.filter(
                        (task) =>
                            task.id !==
                            taskId,
                    );

                return normalizeTaskOrders(
                    updatedTasks,
                );
            },
        );

        setSelectedTask(null);
    }

    /* =====================================================
       EDIT TASK
    ===================================================== */

    function openEditTask(
        task: Task,
    ) {
        setSelectedTask(null);

        setEditingTask(task);

        setTaskTitle(
            task.title,
        );

        setTaskDescription(
            task.description,
        );

        setTaskStatus(
            task.status,
        );

        setTaskPriority(
            task.priority,
        );

        setTaskDueDate(
            task.dueDate,
        );

        setTaskAssignee(
            task.assignee,
        );
    }

    function saveTask() {
        if (!editingTask) return;

        if (!taskTitle.trim()) return;

        setTasks(
            (previousTasks) => {
                const updatedTasks =
                    previousTasks.map(
                        (task) =>
                            task.id ===
                                editingTask.id
                                ? {
                                    ...task,
                                    title:
                                        taskTitle.trim(),
                                    description:
                                        taskDescription.trim(),
                                    status:
                                        taskStatus,
                                    priority:
                                        taskPriority,
                                    dueDate:
                                        taskDueDate,
                                    assignee:
                                        taskAssignee.trim(),
                                }
                                : task,
                    );

                return normalizeTaskOrders(
                    updatedTasks,
                );
            },
        );

        setEditingTask(null);
    }

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div className="mx-auto max-w-[1250px]">

            {/* HEADER */}

            <section className="mb-8">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#849595]">
                    Personal Workspace
                </p>

                <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">

                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight text-[#29494a]">
                            My Tasks
                        </h1>

                        <p className="mt-2 text-sm text-[#849595]">
                            Stay focused and keep track of what needs your attention.
                        </p>
                    </div>

                    <div className="rounded-xl border border-[#dce4e2] bg-[#f9faf9] px-4 py-3">

                        <p className="text-[10px] uppercase tracking-wider text-[#8a9b9b]">
                            Today
                        </p>

                        <p className="mt-1 text-sm font-medium text-[#29494a]">
                            {new Date().toLocaleDateString(
                                "en-US",
                                {
                                    weekday:
                                        "long",
                                    month:
                                        "short",
                                    day:
                                        "numeric",
                                },
                            )}
                        </p>

                    </div>

                </div>
            </section>

            {/* STATISTICS */}

            <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    icon={
                        <ListTodo
                            size={19}
                        />
                    }
                    label="Total Tasks"
                    value={
                        statistics.total
                    }
                />

                <StatCard
                    icon={
                        <Clock3
                            size={19}
                        />
                    }
                    label="In Progress"
                    value={
                        statistics.inProgress
                    }
                />

                <StatCard
                    icon={
                        <CheckCircle2
                            size={19}
                        />
                    }
                    label="Completed"
                    value={
                        statistics.completed
                    }
                />

                <StatCard
                    icon={
                        <AlertTriangle
                            size={19}
                        />
                    }
                    label="Overdue"
                    value={
                        statistics.overdue
                    }
                    danger
                />

            </section>

            {/* SEARCH + FILTERS */}

            <section className="mb-8 rounded-2xl border border-[#e1e7e5] bg-[#f9faf9] p-4">

                <div className="flex flex-col gap-3 xl:flex-row">

                    {/* SEARCH */}

                    <div className="relative flex-1">

                        <Search
                            size={17}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a9b9b]"
                        />

                        <input
                            value={
                                searchQuery
                            }
                            onChange={(
                                event,
                            ) =>
                                setSearchQuery(
                                    event.target
                                        .value,
                                )
                            }
                            placeholder="Search tasks, assignees or projects..."
                            className="w-full rounded-xl border border-[#dce4e2] bg-white py-2.5 pl-10 pr-4 text-sm text-[#29494a] outline-none placeholder:text-[#a7b3b3] focus:border-[#527273]"
                        />

                    </div>

                    {/* STATUS */}

                    <select
                        value={
                            statusFilter
                        }
                        onChange={(
                            event,
                        ) =>
                            setStatusFilter(
                                event.target
                                    .value as
                                | "all"
                                | TaskStatus,
                            )
                        }
                        className="rounded-xl border border-[#dce4e2] bg-white px-4 py-2.5 text-sm text-[#527273] outline-none focus:border-[#527273]"
                    >

                        <option value="all">
                            All Status
                        </option>

                        <option value="todo">
                            To Do
                        </option>

                        <option value="progress">
                            In Progress
                        </option>

                        <option value="done">
                            Completed
                        </option>

                    </select>

                    {/* PRIORITY */}

                    <select
                        value={
                            priorityFilter
                        }
                        onChange={(
                            event,
                        ) =>
                            setPriorityFilter(
                                event.target
                                    .value as
                                | "all"
                                | TaskPriority,
                            )
                        }
                        className="rounded-xl border border-[#dce4e2] bg-white px-4 py-2.5 text-sm text-[#527273] outline-none focus:border-[#527273]"
                    >

                        <option value="all">
                            All Priority
                        </option>

                        <option value="high">
                            High Priority
                        </option>

                        <option value="medium">
                            Medium Priority
                        </option>

                        <option value="low">
                            Low Priority
                        </option>

                    </select>

                    {/* PROJECT */}

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
                        className="rounded-xl border border-[#dce4e2] bg-white px-4 py-2.5 text-sm text-[#527273] outline-none focus:border-[#527273]"
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

                    {/* CLEAR */}

                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={
                                clearFilters
                            }
                            className="flex items-center justify-center gap-2 rounded-xl border border-[#dce4e2] bg-white px-4 py-2.5 text-sm text-[#718282] transition hover:bg-[#eef2f1]"
                        >
                            <RotateCcw
                                size={16}
                            />
                            Clear
                        </button>
                    )}

                </div>

                <p className="mt-3 text-xs text-[#849595]">
                    Showing{" "}

                    <span className="font-semibold text-[#527273]">
                        {
                            filteredTasks.length
                        }
                    </span>

                    {" "}of{" "}

                    <span className="font-semibold text-[#527273]">
                        {
                            tasks.length
                        }
                    </span>

                    {" "}tasks
                </p>

            </section>

            {/* EMPTY STATE */}

            {tasks.length === 0 && (
                <div className="rounded-2xl border border-dashed border-[#d6dfdc] bg-[#fafbfa] px-6 py-16 text-center">

                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#e6f0ee] text-[#315b5d]">

                        <ListTodo
                            size={22}
                        />

                    </div>

                    <h2 className="mt-5 text-lg font-semibold text-[#29494a]">
                        No tasks yet
                    </h2>

                    <p className="mt-2 text-sm text-[#849595]">
                        Create tasks from a project board and they will appear here automatically.
                    </p>

                </div>
            )}

            {/* OVERDUE */}

            {tasks.length > 0 &&
                overdueTasks.length > 0 && (
                    <TaskSection
                        title="Overdue"
                        description="These tasks need immediate attention."
                        icon={
                            <AlertTriangle
                                size={18}
                                className="text-[#c65b50]"
                            />
                        }
                        tasks={
                            overdueTasks
                        }
                        getProjectName={
                            getProjectName
                        }
                        onToggle={
                            toggleTaskCompletion
                        }
                        onSelect={
                            setSelectedTask
                        }
                        overdue
                    />
                )}

            {/* TODAY */}

            {tasks.length > 0 && (
                <TaskSection
                    title="Today"
                    description="Focus on what you can complete today."
                    icon={
                        <CalendarDays
                            size={18}
                            className="text-[#527273]"
                        />
                    }
                    tasks={
                        todayTasks
                    }
                    getProjectName={
                        getProjectName
                    }
                    onToggle={
                        toggleTaskCompletion
                    }
                    onSelect={
                        setSelectedTask
                    }
                />
            )}

            {/* UPCOMING */}

            {tasks.length > 0 && (
                <TaskSection
                    title="Upcoming"
                    description="Plan ahead and stay prepared."
                    icon={
                        <Clock3
                            size={18}
                            className="text-[#527273]"
                        />
                    }
                    tasks={
                        upcomingTasks
                    }
                    getProjectName={
                        getProjectName
                    }
                    onToggle={
                        toggleTaskCompletion
                    }
                    onSelect={
                        setSelectedTask
                    }
                />
            )}

            {/* NO DUE DATE */}

            {tasks.length > 0 &&
                noDueDateTasks.length > 0 && (
                    <TaskSection
                        title="No Due Date"
                        description="Tasks that still need to be scheduled."
                        icon={
                            <ListTodo
                                size={18}
                                className="text-[#849595]"
                            />
                        }
                        tasks={
                            noDueDateTasks
                        }
                        getProjectName={
                            getProjectName
                        }
                        onToggle={
                            toggleTaskCompletion
                        }
                        onSelect={
                            setSelectedTask
                        }
                    />
                )}

            {/* COMPLETED */}

            {tasks.length > 0 &&
                completedTasks.length >
                0 && (
                    <TaskSection
                        title="Completed"
                        description="Tasks you have successfully finished."
                        icon={
                            <CheckCircle2
                                size={18}
                                className="text-[#4c8774]"
                            />
                        }
                        tasks={
                            completedTasks
                        }
                        getProjectName={
                            getProjectName
                        }
                        onToggle={
                            toggleTaskCompletion
                        }
                        onSelect={
                            setSelectedTask
                        }
                        completed
                    />
                )}

            {/* NO FILTER RESULTS */}

            {tasks.length > 0 &&
                filteredTasks.length ===
                0 && (
                    <div className="rounded-2xl border border-dashed border-[#d6dfdc] bg-[#fafbfa] px-6 py-12 text-center">

                        <Search
                            size={22}
                            className="mx-auto text-[#849595]"
                        />

                        <h2 className="mt-4 text-base font-semibold text-[#29494a]">
                            No matching tasks
                        </h2>

                        <p className="mt-2 text-sm text-[#849595]">
                            Try changing your search or filters.
                        </p>

                        <button
                            type="button"
                            onClick={
                                clearFilters
                            }
                            className="mt-5 rounded-xl bg-[#214f51] px-4 py-2.5 text-sm font-medium text-white"
                        >
                            Clear Filters
                        </button>

                    </div>
                )}

            {/* TASK DETAILS MODAL */}

            {selectedTask && (
                <TaskDetailsModal
                    task={
                        selectedTask
                    }
                    projectName={
                        getProjectName(
                            selectedTask.projectId,
                        )
                    }
                    onClose={() =>
                        setSelectedTask(
                            null,
                        )
                    }
                    onEdit={() =>
                        openEditTask(
                            selectedTask,
                        )
                    }
                    onDelete={() =>
                        deleteTask(
                            selectedTask.id,
                        )
                    }
                    onToggle={() =>
                        toggleTaskCompletion(
                            selectedTask.id,
                        )
                    }
                />
            )}

            {/* EDIT TASK MODAL */}

            {editingTask && (
                <EditTaskModal
                    taskTitle={
                        taskTitle
                    }
                    taskDescription={
                        taskDescription
                    }
                    taskStatus={
                        taskStatus
                    }
                    taskPriority={
                        taskPriority
                    }
                    taskDueDate={
                        taskDueDate
                    }
                    taskAssignee={
                        taskAssignee
                    }
                    onClose={() =>
                        setEditingTask(
                            null,
                        )
                    }
                    onSave={
                        saveTask
                    }
                    setTaskTitle={
                        setTaskTitle
                    }
                    setTaskDescription={
                        setTaskDescription
                    }
                    setTaskStatus={
                        setTaskStatus
                    }
                    setTaskPriority={
                        setTaskPriority
                    }
                    setTaskDueDate={
                        setTaskDueDate
                    }
                    setTaskAssignee={
                        setTaskAssignee
                    }
                />
            )}

        </div>
    );
}

/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
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
   TASK SECTION
===================================================== */

function TaskSection({
    title,
    description,
    icon,
    tasks,
    getProjectName,
    onToggle,
    onSelect,
    overdue = false,
    completed = false,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    tasks: Task[];
    getProjectName: (
        projectId: string,
    ) => string;
    onToggle: (
        id: string,
    ) => void;
    onSelect: (
        task: Task,
    ) => void;
    overdue?: boolean;
    completed?: boolean;
}) {
    return (
        <section className="mb-9">

            <div className="mb-4 flex items-end justify-between">

                <div>
                    <div className="flex items-center gap-2">

                        {icon}

                        <h2 className="text-lg font-semibold text-[#29494a]">
                            {title}
                        </h2>

                        <span className="rounded-md bg-[#edf1f0] px-2 py-0.5 text-[10px] text-[#849595]">
                            {tasks.length}
                        </span>

                    </div>

                    <p className="mt-1 text-xs text-[#849595]">
                        {description}
                    </p>

                </div>

            </div>

            {tasks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#d6dfdc] bg-[#fafbfa] px-5 py-10 text-center">

                    <p className="text-sm text-[#849595]">
                        No tasks here. You're all clear.
                    </p>

                </div>
            ) : (
                <div className="space-y-3">

                    {tasks.map(
                        (task) => (
                            <TaskRow
                                key={
                                    task.id
                                }
                                task={
                                    task
                                }
                                projectName={getProjectName(
                                    task.projectId,
                                )}
                                onToggle={() =>
                                    onToggle(
                                        task.id,
                                    )
                                }
                                onSelect={() =>
                                    onSelect(
                                        task,
                                    )
                                }
                                overdue={
                                    overdue
                                }
                                completed={
                                    completed
                                }
                            />
                        ),
                    )}

                </div>
            )}

        </section>
    );
}

/* =====================================================
   TASK ROW
===================================================== */

function TaskRow({
    task,
    projectName,
    onToggle,
    onSelect,
    overdue,
    completed,
}: {
    task: Task;
    projectName: string;
    onToggle: () => void;
    onSelect: () => void;
    overdue: boolean;
    completed: boolean;
}) {
    const priorityStyles = {
        high:
            "bg-[#fbe0da] text-[#b85d4c]",
        medium:
            "bg-[#f6edd1] text-[#a9842f]",
        low:
            "bg-[#dceee8] text-[#4c8774]",
    };

    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-[#e1e7e5] bg-white p-4 transition hover:border-[#c7d4d0] hover:shadow-sm sm:flex-row sm:items-center">

            {/* COMPLETE */}

            <button
                type="button"
                onClick={onToggle}
                className="flex-shrink-0"
            >
                {task.status ===
                    "done" ? (
                    <CheckCircle2
                        size={22}
                        className="text-[#4c8774]"
                    />
                ) : (
                    <Circle
                        size={22}
                        className="text-[#aebbbb] transition hover:text-[#527273]"
                    />
                )}
            </button>

            {/* TASK */}

            <button
                type="button"
                onClick={onSelect}
                className="min-w-0 flex-1 text-left"
            >

                <div className="flex flex-wrap items-center gap-2">

                    <h3
                        className={`text-sm font-medium ${completed
                                ? "text-[#a2afad] line-through"
                                : "text-[#29494a]"
                            }`}
                    >
                        {task.title}
                    </h3>

                    <span className="rounded-md bg-[#edf3f1] px-2 py-0.5 text-[9px] font-medium text-[#527273]">
                        {projectName}
                    </span>

                </div>

                {task.description && (
                    <p className="mt-1 truncate text-xs text-[#849595]">
                        {
                            task.description
                        }
                    </p>
                )}

            </button>

            {/* META */}

            <div className="flex items-center gap-3 sm:justify-end">

                <span
                    className={`rounded-md px-2.5 py-1 text-[10px] font-medium capitalize ${priorityStyles[
                        task.priority
                        ]
                        }`}
                >
                    {task.priority}
                </span>

                <span
                    className={`text-xs ${overdue
                            ? "font-medium text-[#c65b50]"
                            : "text-[#849595]"
                        }`}
                >
                    {task.dueDate ||
                        "No due date"}
                </span>

                {task.assignee && (
                    <div className="grid h-7 min-w-7 place-items-center rounded-full bg-[#e6f0ee] px-2 text-[10px] font-semibold text-[#527273]">

                        {
                            task.assignee
                        }

                    </div>
                )}

            </div>

        </div>
    );
}

/* =====================================================
   TASK DETAILS MODAL
===================================================== */

function TaskDetailsModal({
    task,
    projectName,
    onClose,
    onEdit,
    onDelete,
    onToggle,
}: {
    task: Task;
    projectName: string;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onToggle: () => void;
}) {
    const priorityStyles = {
        high:
            "bg-[#fbe0da] text-[#b85d4c]",
        medium:
            "bg-[#f6edd1] text-[#a9842f]",
        low:
            "bg-[#dceee8] text-[#4c8774]",
    };

    const statusLabel =
        task.status === "todo"
            ? "To Do"
            : task.status ===
                "progress"
                ? "In Progress"
                : "Completed";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#163536]/30 p-4 backdrop-blur-sm">

            <div className="w-full max-w-lg rounded-2xl bg-[#f9faf9] p-6 shadow-2xl">

                {/* HEADER */}

                <div className="flex items-start justify-between">

                    <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#849595]">
                            Task Details
                        </p>

                        <h2 className="mt-2 text-xl font-semibold text-[#29494a]">
                            {task.title}
                        </h2>

                        <p className="mt-2 text-xs font-medium text-[#527273]">
                            {projectName}
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="grid h-9 w-9 place-items-center rounded-lg text-[#718282] transition hover:bg-[#edf1f0]"
                    >
                        <X size={18} />
                    </button>

                </div>

                {/* DESCRIPTION */}

                <p className="mt-6 text-sm leading-6 text-[#718282]">
                    {task.description ||
                        "No description added."}
                </p>

                {/* DETAILS */}

                <div className="mt-7 grid grid-cols-2 gap-3">

                    <TaskDetail
                        label="Status"
                        value={
                            statusLabel
                        }
                    />

                    <TaskDetail
                        label="Priority"
                        value={
                            task.priority
                        }
                        className={
                            priorityStyles[
                            task
                                .priority
                            ]
                        }
                    />

                    <TaskDetail
                        label="Due Date"
                        value={
                            task.dueDate ||
                            "Not assigned"
                        }
                    />

                    <TaskDetail
                        label="Assignee"
                        value={
                            task.assignee ||
                            "Unassigned"
                        }
                    />

                </div>

                {/* ACTIONS */}

                <div className="mt-8 flex flex-wrap items-center justify-between gap-3">

                    <button
                        type="button"
                        onClick={
                            onDelete
                        }
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#c65b50] transition hover:bg-[#fde8e4]"
                    >
                        <Trash2
                            size={16}
                        />
                        Delete
                    </button>

                    <div className="flex gap-2">

                        <button
                            type="button"
                            onClick={
                                onToggle
                            }
                            className="rounded-xl border border-[#dce4e2] bg-white px-4 py-2.5 text-sm font-medium text-[#527273] transition hover:bg-[#eef2f1]"
                        >
                            {task.status ===
                                "done"
                                ? "Mark Active"
                                : "Mark Complete"}
                        </button>

                        <button
                            type="button"
                            onClick={
                                onEdit
                            }
                            className="flex items-center gap-2 rounded-xl bg-[#214f51] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#183f41]"
                        >
                            <Edit3
                                size={16}
                            />
                            Edit
                        </button>

                    </div>

                </div>

            </div>
        </div>
    );
}

/* =====================================================
   TASK DETAIL
===================================================== */

function TaskDetail({
    label,
    value,
    className = "",
}: {
    label: string;
    value: string;
    className?: string;
}) {
    return (
        <div className="rounded-xl bg-white p-3">

            <p className="text-[10px] uppercase tracking-wider text-[#8a9b9b]">
                {label}
            </p>

            <p
                className={`mt-1 inline-block rounded-md text-sm font-medium capitalize text-[#29494a] ${className}`}
            >
                {value}
            </p>

        </div>
    );
}

/* =====================================================
   EDIT TASK MODAL
===================================================== */

function EditTaskModal({
    taskTitle,
    taskDescription,
    taskStatus,
    taskPriority,
    taskDueDate,
    taskAssignee,
    onClose,
    onSave,
    setTaskTitle,
    setTaskDescription,
    setTaskStatus,
    setTaskPriority,
    setTaskDueDate,
    setTaskAssignee,
}: {
    taskTitle: string;
    taskDescription: string;
    taskStatus: TaskStatus;
    taskPriority: TaskPriority;
    taskDueDate: string;
    taskAssignee: string;
    onClose: () => void;
    onSave: () => void;
    setTaskTitle: (
        value: string,
    ) => void;
    setTaskDescription: (
        value: string,
    ) => void;
    setTaskStatus: (
        value: TaskStatus,
    ) => void;
    setTaskPriority: (
        value: TaskPriority,
    ) => void;
    setTaskDueDate: (
        value: string,
    ) => void;
    setTaskAssignee: (
        value: string,
    ) => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#163536]/30 p-4 backdrop-blur-sm">

            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-[#f9faf9] p-6 shadow-2xl">

                {/* HEADER */}

                <div className="flex items-center justify-between">

                    <div>
                        <h2 className="text-lg font-semibold text-[#29494a]">
                            Edit Task
                        </h2>

                        <p className="mt-1 text-xs text-[#849595]">
                            Update your task details.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={
                            onClose
                        }
                        className="grid h-9 w-9 place-items-center rounded-lg transition hover:bg-[#edf1f0]"
                    >
                        <X size={18} />
                    </button>

                </div>

                {/* TITLE */}

                <div className="mt-6">

                    <label className="text-xs font-medium text-[#527273]">
                        Task title
                    </label>

                    <input
                        autoFocus
                        value={
                            taskTitle
                        }
                        onChange={(
                            event,
                        ) =>
                            setTaskTitle(
                                event.target
                                    .value,
                            )
                        }
                        className="mt-2 w-full rounded-xl border border-[#dce4e2] bg-white px-4 py-3 text-sm text-[#29494a] outline-none focus:border-[#527273]"
                    />

                </div>

                {/* DESCRIPTION */}

                <div className="mt-5">

                    <label className="text-xs font-medium text-[#527273]">
                        Description
                    </label>

                    <textarea
                        rows={4}
                        value={
                            taskDescription
                        }
                        onChange={(
                            event,
                        ) =>
                            setTaskDescription(
                                event.target
                                    .value,
                            )
                        }
                        className="mt-2 w-full resize-none rounded-xl border border-[#dce4e2] bg-white px-4 py-3 text-sm text-[#29494a] outline-none focus:border-[#527273]"
                    />

                </div>

                {/* STATUS + PRIORITY */}

                <div className="mt-5 grid gap-4 sm:grid-cols-2">

                    <div>

                        <label className="text-xs font-medium text-[#527273]">
                            Status
                        </label>

                        <select
                            value={
                                taskStatus
                            }
                            onChange={(
                                event,
                            ) =>
                                setTaskStatus(
                                    event.target
                                        .value as TaskStatus,
                                )
                            }
                            className="mt-2 w-full rounded-xl border border-[#dce4e2] bg-white px-4 py-3 text-sm text-[#29494a] outline-none focus:border-[#527273]"
                        >

                            <option value="todo">
                                To Do
                            </option>

                            <option value="progress">
                                In Progress
                            </option>

                            <option value="done">
                                Completed
                            </option>

                        </select>

                    </div>

                    <div>

                        <label className="text-xs font-medium text-[#527273]">
                            Priority
                        </label>

                        <select
                            value={
                                taskPriority
                            }
                            onChange={(
                                event,
                            ) =>
                                setTaskPriority(
                                    event.target
                                        .value as TaskPriority,
                                )
                            }
                            className="mt-2 w-full rounded-xl border border-[#dce4e2] bg-white px-4 py-3 text-sm text-[#29494a] outline-none focus:border-[#527273]"
                        >

                            <option value="high">
                                High
                            </option>

                            <option value="medium">
                                Medium
                            </option>

                            <option value="low">
                                Low
                            </option>

                        </select>

                    </div>

                </div>

                {/* ASSIGNEE */}

                <div className="mt-5">

                    <label className="text-xs font-medium text-[#527273]">
                        Assignee
                    </label>

                    <input
                        value={
                            taskAssignee
                        }
                        onChange={(
                            event,
                        ) =>
                            setTaskAssignee(
                                event.target
                                    .value,
                            )
                        }
                        placeholder="Enter assignee name"
                        className="mt-2 w-full rounded-xl border border-[#dce4e2] bg-white px-4 py-3 text-sm text-[#29494a] outline-none focus:border-[#527273]"
                    />

                </div>

                {/* DUE DATE */}

                <div className="mt-5">

                    <label className="text-xs font-medium text-[#527273]">
                        Due date
                    </label>

                    <input
                        type="date"
                        value={
                            taskDueDate
                        }
                        onChange={(
                            event,
                        ) =>
                            setTaskDueDate(
                                event.target
                                    .value,
                            )
                        }
                        className="mt-2 w-full rounded-xl border border-[#dce4e2] bg-white px-4 py-3 text-sm text-[#29494a] outline-none focus:border-[#527273]"
                    />

                </div>

                {/* ACTIONS */}

                <div className="mt-8 flex justify-end gap-3">

                    <button
                        type="button"
                        onClick={
                            onClose
                        }
                        className="rounded-xl px-4 py-2.5 text-sm font-medium text-[#718282] transition hover:bg-[#edf1f0]"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={
                            onSave
                        }
                        className="rounded-xl bg-[#214f51] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#183f41]"
                    >
                        Save Changes
                    </button>

                </div>

            </div>
        </div>
    );
}

export default MyTasks;