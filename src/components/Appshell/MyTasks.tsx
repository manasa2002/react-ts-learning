import { useEffect, useMemo, useState } from "react";
import {
    AlertTriangle,
    CalendarDays,
    CheckCircle2,
    Circle,
    Clock3,
    Edit3,
    Filter,
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
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    assignee: string;
    dueDate: string;
}

/* =====================================================
   INITIAL TASKS
===================================================== */

const initialTasks: Task[] = [
    {
        id: 1,
        title: "Create wireframes",
        description:
            "Create the initial wireframes for the website pages and user flows.",
        status: "todo",
        priority: "high",
        assignee: "M",
        dueDate: "2026-09-05",
    },
    {
        id: 2,
        title: "Research competitors",
        description:
            "Analyze competitor products and identify useful UX patterns.",
        status: "todo",
        priority: "medium",
        assignee: "M",
        dueDate: "2026-09-07",
    },
    {
        id: 3,
        title: "Setup repository",
        description:
            "Configure the project repository and development environment.",
        status: "todo",
        priority: "low",
        assignee: "M",
        dueDate: "2026-09-08",
    },
    {
        id: 4,
        title: "Design landing page",
        description:
            "Create the complete UI design for the Trackly landing page.",
        status: "progress",
        priority: "high",
        assignee: "A",
        dueDate: "2026-09-04",
    },
    {
        id: 5,
        title: "Implement hero section",
        description:
            "Develop the landing page hero section using React and Tailwind CSS.",
        status: "progress",
        priority: "medium",
        assignee: "M",
        dueDate: "2026-09-06",
    },
];

/* =====================================================
   MAIN COMPONENT
===================================================== */

function MyTasks() {
    const [tasks, setTasks] = useState<Task[]>(() => {
        const savedTasks = localStorage.getItem("trackly-tasks");

        if (savedTasks) {
            try {
                return JSON.parse(savedTasks);
            } catch {
                return initialTasks;
            }
        }

        return initialTasks;
    });

    const [searchQuery, setSearchQuery] = useState("");

    const [statusFilter, setStatusFilter] = useState<
        "all" | TaskStatus
    >("all");

    const [priorityFilter, setPriorityFilter] = useState<
        "all" | TaskPriority
    >("all");

    const [selectedTask, setSelectedTask] =
        useState<Task | null>(null);

    const [editingTask, setEditingTask] =
        useState<Task | null>(null);

    /* =====================================================
       EDIT FORM STATE
    ===================================================== */

    const [taskTitle, setTaskTitle] = useState("");

    const [taskDescription, setTaskDescription] =
        useState("");

    const [taskStatus, setTaskStatus] =
        useState<TaskStatus>("todo");

    const [taskPriority, setTaskPriority] =
        useState<TaskPriority>("medium");

    const [taskDueDate, setTaskDueDate] =
        useState("");

    /* =====================================================
       LOCAL STORAGE
    ===================================================== */

    useEffect(() => {
        localStorage.setItem(
            "trackly-tasks",
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
       FILTERED TASKS
    ===================================================== */

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const searchMatches =
                task.title
                    .toLowerCase()
                    .includes(
                        searchQuery.toLowerCase(),
                    ) ||
                task.description
                    .toLowerCase()
                    .includes(
                        searchQuery.toLowerCase(),
                    );

            const statusMatches =
                statusFilter === "all" ||
                task.status === statusFilter;

            const priorityMatches =
                priorityFilter === "all" ||
                task.priority === priorityFilter;

            return (
                searchMatches &&
                statusMatches &&
                priorityMatches
            );
        });
    }, [
        tasks,
        searchQuery,
        statusFilter,
        priorityFilter,
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
    }, [filteredTasks, today]);

    const todayTasks = useMemo(() => {
        return filteredTasks.filter(
            (task) =>
                task.dueDate === today &&
                task.status !== "done",
        );
    }, [filteredTasks, today]);

    const upcomingTasks = useMemo(() => {
        return filteredTasks.filter(
            (task) =>
                task.status !== "done" &&
                task.dueDate &&
                task.dueDate > today,
        );
    }, [filteredTasks, today]);

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
        const total = tasks.length;

        const completed = tasks.filter(
            (task) =>
                task.status === "done",
        ).length;

        const inProgress = tasks.filter(
            (task) =>
                task.status === "progress",
        ).length;

        const overdue = tasks.filter(
            (task) =>
                task.status !== "done" &&
                task.dueDate &&
                task.dueDate < today,
        ).length;

        return {
            total,
            completed,
            inProgress,
            overdue,
        };
    }, [tasks, today]);

    /* =====================================================
       CLEAR FILTERS
    ===================================================== */

    function clearFilters() {
        setSearchQuery("");
        setStatusFilter("all");
        setPriorityFilter("all");
    }

    const hasActiveFilters =
        searchQuery !== "" ||
        statusFilter !== "all" ||
        priorityFilter !== "all";

    /* =====================================================
       COMPLETE TASK
    ===================================================== */

    function toggleTaskCompletion(
        taskId: number,
    ) {
        setTasks((previousTasks) =>
            previousTasks.map((task) =>
                task.id === taskId
                    ? {
                        ...task,
                        status:
                            task.status === "done"
                                ? "todo"
                                : "done",
                    }
                    : task,
            ),
        );
    }

    /* =====================================================
       DELETE TASK
    ===================================================== */

    function deleteTask(taskId: number) {
        const shouldDelete = window.confirm(
            "Are you sure you want to delete this task?",
        );

        if (!shouldDelete) return;

        setTasks((previousTasks) =>
            previousTasks.filter(
                (task) => task.id !== taskId,
            ),
        );

        setSelectedTask(null);
    }

    /* =====================================================
       EDIT TASK
    ===================================================== */

    function openEditTask(task: Task) {
        setSelectedTask(null);

        setEditingTask(task);

        setTaskTitle(task.title);
        setTaskDescription(task.description);
        setTaskStatus(task.status);
        setTaskPriority(task.priority);
        setTaskDueDate(task.dueDate);
    }

    function saveTask() {
        if (!editingTask) return;

        if (!taskTitle.trim()) return;

        setTasks((previousTasks) =>
            previousTasks.map((task) =>
                task.id === editingTask.id
                    ? {
                        ...task,
                        title: taskTitle.trim(),
                        description:
                            taskDescription.trim(),
                        status: taskStatus,
                        priority: taskPriority,
                        dueDate: taskDueDate,
                    }
                    : task,
            ),
        );

        setEditingTask(null);
    }

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div className="mx-auto max-w-[1250px]">

            {/* =================================================
          HEADER
      ================================================= */}

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
                                    weekday: "long",
                                    month: "short",
                                    day: "numeric",
                                },
                            )}
                        </p>
                    </div>
                </div>
            </section>

            {/* =================================================
          STATISTICS
      ================================================= */}

            <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    icon={<ListTodo size={19} />}
                    label="Total Tasks"
                    value={statistics.total}
                />

                <StatCard
                    icon={<Clock3 size={19} />}
                    label="In Progress"
                    value={statistics.inProgress}
                />

                <StatCard
                    icon={<CheckCircle2 size={19} />}
                    label="Completed"
                    value={statistics.completed}
                />

                <StatCard
                    icon={<AlertTriangle size={19} />}
                    label="Overdue"
                    value={statistics.overdue}
                    danger
                />
            </section>

            {/* =================================================
          SEARCH + FILTERS
      ================================================= */}

            <section className="mb-8 rounded-2xl border border-[#e1e7e5] bg-[#f9faf9] p-4">
                <div className="flex flex-col gap-3 lg:flex-row">

                    {/* SEARCH */}

                    <div className="relative flex-1">
                        <Search
                            size={17}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a9b9b]"
                        />

                        <input
                            value={searchQuery}
                            onChange={(event) =>
                                setSearchQuery(
                                    event.target.value,
                                )
                            }
                            placeholder="Search your tasks..."
                            className="w-full rounded-xl border border-[#dce4e2] bg-white py-2.5 pl-10 pr-4 text-sm text-[#29494a] outline-none placeholder:text-[#a7b3b3] focus:border-[#527273]"
                        />
                    </div>

                    {/* STATUS */}

                    <select
                        value={statusFilter}
                        onChange={(event) =>
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
                        value={priorityFilter}
                        onChange={(event) =>
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

                    {/* CLEAR */}

                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="flex items-center justify-center gap-2 rounded-xl border border-[#dce4e2] bg-white px-4 py-2.5 text-sm text-[#718282] transition hover:bg-[#eef2f1]"
                        >
                            <RotateCcw size={16} />
                            Clear
                        </button>
                    )}
                </div>

                {hasActiveFilters && (
                    <p className="mt-3 text-xs text-[#849595]">
                        Showing{" "}
                        <span className="font-semibold text-[#527273]">
                            {filteredTasks.length}
                        </span>{" "}
                        matching tasks.
                    </p>
                )}
            </section>

            {/* =================================================
          OVERDUE
      ================================================= */}

            {overdueTasks.length > 0 && (
                <TaskSection
                    title="Overdue"
                    description="These tasks need immediate attention."
                    icon={
                        <AlertTriangle
                            size={18}
                            className="text-[#c65b50]"
                        />
                    }
                    tasks={overdueTasks}
                    onToggle={toggleTaskCompletion}
                    onSelect={setSelectedTask}
                    overdue
                />
            )}

            {/* =================================================
          TODAY
      ================================================= */}

            <TaskSection
                title="Today"
                description="Focus on what you can complete today."
                icon={
                    <CalendarDays
                        size={18}
                        className="text-[#527273]"
                    />
                }
                tasks={todayTasks}
                onToggle={toggleTaskCompletion}
                onSelect={setSelectedTask}
            />

            {/* =================================================
          UPCOMING
      ================================================= */}

            <TaskSection
                title="Upcoming"
                description="Plan ahead and stay prepared."
                icon={
                    <Clock3
                        size={18}
                        className="text-[#527273]"
                    />
                }
                tasks={upcomingTasks}
                onToggle={toggleTaskCompletion}
                onSelect={setSelectedTask}
            />

            {/* =================================================
          COMPLETED
      ================================================= */}

            {completedTasks.length > 0 && (
                <TaskSection
                    title="Completed"
                    description="Tasks you have successfully finished."
                    icon={
                        <CheckCircle2
                            size={18}
                            className="text-[#4c8774]"
                        />
                    }
                    tasks={completedTasks}
                    onToggle={toggleTaskCompletion}
                    onSelect={setSelectedTask}
                    completed
                />
            )}

            {/* =================================================
          TASK DETAILS MODAL
      ================================================= */}

            {selectedTask && (
                <TaskDetailsModal
                    task={selectedTask}
                    onClose={() =>
                        setSelectedTask(null)
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

            {/* =================================================
          EDIT TASK MODAL
      ================================================= */}

            {editingTask && (
                <EditTaskModal
                    taskTitle={taskTitle}
                    taskDescription={
                        taskDescription
                    }
                    taskStatus={taskStatus}
                    taskPriority={
                        taskPriority
                    }
                    taskDueDate={taskDueDate}
                    onClose={() =>
                        setEditingTask(null)
                    }
                    onSave={saveTask}
                    setTaskTitle={setTaskTitle}
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
    onToggle,
    onSelect,
    overdue = false,
    completed = false,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    tasks: Task[];
    onToggle: (id: number) => void;
    onSelect: (task: Task) => void;
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
                    {tasks.map((task) => (
                        <TaskRow
                            key={task.id}
                            task={task}
                            onToggle={() =>
                                onToggle(task.id)
                            }
                            onSelect={() =>
                                onSelect(task)
                            }
                            overdue={overdue}
                            completed={completed}
                        />
                    ))}
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
    onToggle,
    onSelect,
    overdue,
    completed,
}: {
    task: Task;
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
            {/* COMPLETE BUTTON */}

            <button
                type="button"
                onClick={onToggle}
                className="flex-shrink-0"
            >
                {task.status === "done" ? (
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
                <h3
                    className={`text-sm font-medium ${completed
                        ? "text-[#a2afad] line-through"
                        : "text-[#29494a]"
                        }`}
                >
                    {task.title}
                </h3>

                {task.description && (
                    <p className="mt-1 truncate text-xs text-[#849595]">
                        {task.description}
                    </p>
                )}
            </button>

            {/* META */}

            <div className="flex items-center gap-3 sm:justify-end">
                <span
                    className={`rounded-md px-2.5 py-1 text-[10px] font-medium ${priorityStyles[
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

                <div className="grid h-7 w-7 place-items-center rounded-full bg-[#e6f0ee] text-[10px] font-semibold text-[#527273]">
                    {task.assignee}
                </div>
            </div>
        </div>
    );
}

/* =====================================================
   TASK DETAILS MODAL
===================================================== */

function TaskDetailsModal({
    task,
    onClose,
    onEdit,
    onDelete,
    onToggle,
}: {
    task: Task;
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
                        value={task.status}
                    />

                    <TaskDetail
                        label="Priority"
                        value={task.priority}
                        className={
                            priorityStyles[
                            task.priority
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
                        value={task.assignee}
                    />
                </div>

                {/* ACTIONS */}

                <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={onDelete}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#c65b50] transition hover:bg-[#fde8e4]"
                    >
                        <Trash2 size={16} />
                        Delete
                    </button>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onToggle}
                            className="rounded-xl border border-[#dce4e2] bg-white px-4 py-2.5 text-sm font-medium text-[#527273] transition hover:bg-[#eef2f1]"
                        >
                            {task.status === "done"
                                ? "Mark Active"
                                : "Mark Complete"}
                        </button>

                        <button
                            type="button"
                            onClick={onEdit}
                            className="flex items-center gap-2 rounded-xl bg-[#214f51] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#183f41]"
                        >
                            <Edit3 size={16} />
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
    onClose,
    onSave,
    setTaskTitle,
    setTaskDescription,
    setTaskStatus,
    setTaskPriority,
    setTaskDueDate,
}: {
    taskTitle: string;
    taskDescription: string;
    taskStatus: TaskStatus;
    taskPriority: TaskPriority;
    taskDueDate: string;
    onClose: () => void;
    onSave: () => void;
    setTaskTitle: (value: string) => void;
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
                        onClick={onClose}
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
                        value={taskTitle}
                        onChange={(event) =>
                            setTaskTitle(
                                event.target.value,
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
                        value={taskDescription}
                        onChange={(event) =>
                            setTaskDescription(
                                event.target.value,
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
                            value={taskStatus}
                            onChange={(event) =>
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
                            value={taskPriority}
                            onChange={(event) =>
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

                {/* DUE DATE */}

                <div className="mt-5">
                    <label className="text-xs font-medium text-[#527273]">
                        Due date
                    </label>

                    <input
                        type="date"
                        value={taskDueDate}
                        onChange={(event) =>
                            setTaskDueDate(
                                event.target.value,
                            )
                        }
                        className="mt-2 w-full rounded-xl border border-[#dce4e2] bg-white px-4 py-3 text-sm text-[#29494a] outline-none focus:border-[#527273]"
                    />
                </div>

                {/* ACTIONS */}

                <div className="mt-8 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl px-4 py-2.5 text-sm font-medium text-[#718282] transition hover:bg-[#edf1f0]"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onSave}
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