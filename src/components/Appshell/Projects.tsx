import {
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import {
    closestCorners,
    DndContext,
    DragOverlay,
    PointerSensor,
    useDroppable,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
} from "@dnd-kit/core";

import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import {
    AlertTriangle,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Edit3,
    Filter,
    MoreHorizontal,
    Plus,
    RotateCcw,
    Search,
    Trash2,
    Users,
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

interface ProjectInfoProps {
    icon: ReactNode;
    label: string;
    value: string;
}

interface BoardColumnProps {
    id: TaskStatus;
    title: string;
    tasks: Task[];
    onAddTask: () => void;
    onTaskClick: (task: Task) => void;
}

/* =====================================================
   INITIAL DATA
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
    {
        id: 6,
        title: "Responsive header",
        description:
            "Make the navigation responsive for desktop, tablet and mobile.",
        status: "progress",
        priority: "medium",
        assignee: "R",
        dueDate: "2026-09-06",
    },
    {
        id: 7,
        title: "Project brief",
        description:
            "Finalize and approve the project requirements and goals.",
        status: "done",
        priority: "high",
        assignee: "M",
        dueDate: "2026-09-01",
    },
    {
        id: 8,
        title: "Color palette",
        description:
            "Create and finalize the product color system.",
        status: "done",
        priority: "medium",
        assignee: "A",
        dueDate: "2026-09-01",
    },
    {
        id: 9,
        title: "Typography",
        description:
            "Define typography rules for the application.",
        status: "done",
        priority: "low",
        assignee: "R",
        dueDate: "2026-09-01",
    },
];

/* =====================================================
   COLUMNS
===================================================== */

const columns: {
    id: TaskStatus;
    title: string;
}[] = [
        {
            id: "todo",
            title: "To Do",
        },
        {
            id: "progress",
            title: "In Progress",
        },
        {
            id: "done",
            title: "Done",
        },
    ];

/* =====================================================
   MAIN COMPONENT
===================================================== */

function Projects() {
    /* =========================
       TASK STATE
    ========================= */

    const [tasks, setTasks] = useState<Task[]>(() => {
        const savedTasks =
            localStorage.getItem(
                "trackly-tasks",
            );

        if (savedTasks) {
            try {
                return JSON.parse(
                    savedTasks,
                );
            } catch {
                return initialTasks;
            }
        }

        return initialTasks;
    });

    /* =========================
       MODAL STATE
    ========================= */

    const [activeTask, setActiveTask] =
        useState<Task | null>(null);

    const [selectedTask, setSelectedTask] =
        useState<Task | null>(null);

    const [isModalOpen, setIsModalOpen] =
        useState(false);

    const [editingTaskId, setEditingTaskId] =
        useState<number | null>(null);

    /* =========================
       FILTER STATE
    ========================= */

    const [searchQuery, setSearchQuery] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState<"all" | TaskStatus>(
            "all",
        );

    const [
        priorityFilter,
        setPriorityFilter,
    ] = useState<
        "all" | TaskPriority
    >("all");

    /* =========================
       FORM STATE
    ========================= */

    const [taskTitle, setTaskTitle] =
        useState("");

    const [
        taskDescription,
        setTaskDescription,
    ] = useState("");

    const [taskStatus, setTaskStatus] =
        useState<TaskStatus>("todo");

    const [
        taskPriority,
        setTaskPriority,
    ] = useState<TaskPriority>(
        "medium",
    );

    const [taskDueDate, setTaskDueDate] =
        useState("");

    /* =========================
       DRAG SENSOR
    ========================= */

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
    );

    /* =========================
       LOCAL STORAGE
    ========================= */

    useEffect(() => {
        localStorage.setItem(
            "trackly-tasks",
            JSON.stringify(tasks),
        );
    }, [tasks]);

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
                task.priority ===
                priorityFilter;

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
       TASK STATISTICS
    ===================================================== */

    const statistics = useMemo(() => {
        const total = tasks.length;

        const todo = tasks.filter(
            (task) =>
                task.status === "todo",
        ).length;

        const progress = tasks.filter(
            (task) =>
                task.status === "progress",
        ).length;

        const done = tasks.filter(
            (task) =>
                task.status === "done",
        ).length;

        const overdue = tasks.filter(
            (task) => {
                if (
                    !task.dueDate ||
                    task.status === "done"
                ) {
                    return false;
                }

                return (
                    new Date(task.dueDate) <
                    new Date()
                );
            },
        ).length;

        return {
            total,
            todo,
            progress,
            done,
            overdue,
        };
    }, [tasks]);

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
       OPEN CREATE MODAL
    ===================================================== */

    function openAddTaskModal(
        status: TaskStatus = "todo",
    ) {
        setSelectedTask(null);
        setEditingTaskId(null);

        setTaskTitle("");
        setTaskDescription("");
        setTaskStatus(status);
        setTaskPriority("medium");
        setTaskDueDate("");

        setIsModalOpen(true);
    }

    /* =====================================================
       OPEN EDIT MODAL
    ===================================================== */

    function openEditTaskModal(
        task: Task,
    ) {
        setSelectedTask(null);

        setEditingTaskId(task.id);

        setTaskTitle(task.title);
        setTaskDescription(
            task.description,
        );
        setTaskStatus(task.status);
        setTaskPriority(task.priority);
        setTaskDueDate(task.dueDate);

        setIsModalOpen(true);
    }

    /* =====================================================
       CREATE / UPDATE TASK
    ===================================================== */

    function handleSaveTask() {
        if (!taskTitle.trim()) return;

        if (
            editingTaskId !== null
        ) {
            setTasks(
                (previousTasks) =>
                    previousTasks.map(
                        (task) =>
                            task.id ===
                                editingTaskId
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
                                }
                                : task,
                    ),
            );
        } else {
            const newTask: Task = {
                id: Date.now(),
                title: taskTitle.trim(),
                description:
                    taskDescription.trim(),
                status: taskStatus,
                priority: taskPriority,
                assignee: "M",
                dueDate: taskDueDate,
            };

            setTasks(
                (previousTasks) => [
                    ...previousTasks,
                    newTask,
                ],
            );
        }

        setIsModalOpen(false);
    }

    /* =====================================================
       DELETE TASK
    ===================================================== */

    function handleDeleteTask(
        taskId: number,
    ) {
        const shouldDelete =
            window.confirm(
                "Are you sure you want to delete this task?",
            );

        if (!shouldDelete) return;

        setTasks(
            (previousTasks) =>
                previousTasks.filter(
                    (task) =>
                        task.id !== taskId,
                ),
        );

        setSelectedTask(null);
    }

    /* =====================================================
       DRAG START
    ===================================================== */

    function handleDragStart(
        event: DragStartEvent,
    ) {
        const taskId = Number(
            event.active.id,
        );

        const task = tasks.find(
            (item) =>
                item.id === taskId,
        );

        if (task) {
            setActiveTask(task);
        }
    }

    /* =====================================================
       DRAG END
       + SAME COLUMN SORTING
       + CROSS COLUMN MOVEMENT
    ===================================================== */

    function handleDragEnd(
        event: DragEndEvent,
    ) {
        const { active, over } =
            event;

        setActiveTask(null);

        if (!over) return;

        const activeId = Number(
            active.id,
        );

        const overId = over.id;

        const activeTask = tasks.find(
            (task) =>
                task.id === activeId,
        );

        if (!activeTask) return;

        /* =========================
           DROPPED ON COLUMN
        ========================= */

        const targetColumn =
            columns.find(
                (column) =>
                    column.id === overId,
            );

        if (targetColumn) {
            setTasks(
                (previousTasks) => {
                    const activeIndex =
                        previousTasks.findIndex(
                            (task) =>
                                task.id ===
                                activeId,
                        );

                    if (
                        activeIndex === -1
                    ) {
                        return previousTasks;
                    }

                    const updatedTasks = [
                        ...previousTasks,
                    ];

                    const movedTask = {
                        ...updatedTasks[
                        activeIndex
                        ],
                        status:
                            targetColumn.id,
                    };

                    updatedTasks.splice(
                        activeIndex,
                        1,
                    );

                    let insertIndex =
                        updatedTasks.length;

                    for (
                        let i =
                            updatedTasks.length -
                            1;
                        i >= 0;
                        i--
                    ) {
                        if (
                            updatedTasks[i]
                                .status ===
                            targetColumn.id
                        ) {
                            insertIndex =
                                i + 1;
                            break;
                        }
                    }

                    updatedTasks.splice(
                        insertIndex,
                        0,
                        movedTask,
                    );

                    return updatedTasks;
                },
            );

            return;
        }

        /* =========================
           DROPPED ON TASK
        ========================= */

        const overTaskId =
            Number(overId);

        const overTask =
            tasks.find(
                (task) =>
                    task.id ===
                    overTaskId,
            );

        if (!overTask) return;

        setTasks(
            (previousTasks) => {
                const oldIndex =
                    previousTasks.findIndex(
                        (task) =>
                            task.id ===
                            activeId,
                    );

                const newIndex =
                    previousTasks.findIndex(
                        (task) =>
                            task.id ===
                            overTaskId,
                    );

                if (
                    oldIndex === -1 ||
                    newIndex === -1
                ) {
                    return previousTasks;
                }

                /* SAME COLUMN */

                if (
                    activeTask.status ===
                    overTask.status
                ) {
                    return arrayMove(
                        previousTasks,
                        oldIndex,
                        newIndex,
                    );
                }

                /* DIFFERENT COLUMN */

                const updatedTasks = [
                    ...previousTasks,
                ];

                updatedTasks[
                    oldIndex
                ] = {
                    ...updatedTasks[
                    oldIndex
                    ],
                    status:
                        overTask.status,
                };

                return arrayMove(
                    updatedTasks,
                    oldIndex,
                    newIndex,
                );
            },
        );
    }

    /* =====================================================
       JSX
    ===================================================== */

    return (
        <div className="mx-auto max-w-[1400px]">

            {/* HEADER */}

            <section className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-[#8a9b9b]">
                            Projects
                        </span>

                        <span className="text-xs text-[#b0baba]">
                            /
                        </span>

                        <span className="text-xs text-[#527273]">
                            Website Redesign
                        </span>
                    </div>

                    <h1 className="mt-3 text-2xl font-semibold text-[#29494a]">
                        Website Redesign
                    </h1>

                    <p className="mt-2 text-sm text-[#849595]">
                        Design and development workspace.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        openAddTaskModal()
                    }
                    className="flex items-center gap-2 rounded-lg bg-[#214f51] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#183f41]"
                >
                    <Plus size={16} />
                    Add task
                </button>
            </section>

            {/* =================================================
          STATISTICS
      ================================================= */}

            <section className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <ProjectInfo
                    icon={
                        <MoreHorizontal
                            size={17}
                        />
                    }
                    label="Total Tasks"
                    value={`${statistics.total}`}
                />

                <ProjectInfo
                    icon={
                        <Clock3 size={17} />
                    }
                    label="To Do"
                    value={`${statistics.todo}`}
                />

                <ProjectInfo
                    icon={
                        <Filter size={17} />
                    }
                    label="In Progress"
                    value={`${statistics.progress}`}
                />

                <ProjectInfo
                    icon={
                        <CheckCircle2
                            size={17}
                        />
                    }
                    label="Completed"
                    value={`${statistics.done}`}
                />

                <ProjectInfo
                    icon={
                        <AlertTriangle
                            size={17}
                        />
                    }
                    label="Overdue"
                    value={`${statistics.overdue}`}
                />
            </section>

            {/* =================================================
          SEARCH + FILTERS
      ================================================= */}

            <section className="mb-7 rounded-2xl border border-[#e1e7e5] bg-[#f9faf9] p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

                    {/* SEARCH */}

                    <div className="relative flex-1">
                        <Search
                            size={17}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a9b9b]"
                        />

                        <input
                            value={searchQuery}
                            onChange={(
                                event,
                            ) =>
                                setSearchQuery(
                                    event.target.value,
                                )
                            }
                            placeholder="Search tasks..."
                            className="w-full rounded-xl border border-[#dce4e2] bg-white py-2.5 pl-10 pr-4 text-sm text-[#29494a] outline-none placeholder:text-[#a7b3b3] focus:border-[#527273]"
                        />
                    </div>

                    {/* STATUS FILTER */}

                    <select
                        value={statusFilter}
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
                            Done
                        </option>
                    </select>

                    {/* PRIORITY FILTER */}

                    <select
                        value={priorityFilter}
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
                            High
                        </option>

                        <option value="medium">
                            Medium
                        </option>

                        <option value="low">
                            Low
                        </option>
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

                {/* FILTER RESULT */}

                {hasActiveFilters && (
                    <p className="mt-3 text-xs text-[#849595]">
                        Showing{" "}
                        <span className="font-semibold text-[#527273]">
                            {
                                filteredTasks.length
                            }
                        </span>{" "}
                        matching tasks.
                    </p>
                )}
            </section>

            {/* =================================================
          KANBAN BOARD
      ================================================= */}

            <DndContext
                sensors={sensors}
                collisionDetection={
                    closestCorners
                }
                onDragStart={
                    handleDragStart
                }
                onDragEnd={
                    handleDragEnd
                }
            >
                <section className="grid gap-4 lg:grid-cols-3">
                    {columns.map(
                        (column) => {
                            const columnTasks =
                                filteredTasks.filter(
                                    (task) =>
                                        task.status ===
                                        column.id,
                                );

                            return (
                                <BoardColumn
                                    key={
                                        column.id
                                    }
                                    id={column.id}
                                    title={
                                        column.title
                                    }
                                    tasks={
                                        columnTasks
                                    }
                                    onAddTask={() =>
                                        openAddTaskModal(
                                            column.id,
                                        )
                                    }
                                    onTaskClick={(
                                        task,
                                    ) =>
                                        setSelectedTask(
                                            task,
                                        )
                                    }
                                />
                            );
                        },
                    )}
                </section>

                {/* DRAG OVERLAY */}

                <DragOverlay>
                    {activeTask ? (
                        <TaskCard
                            task={
                                activeTask
                            }
                            isDragging
                            onClick={() => { }}
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>

            {/* =================================================
          TASK DETAILS MODAL
      ================================================= */}

            {selectedTask && (
                <TaskDetailsModal
                    task={selectedTask}
                    onClose={() =>
                        setSelectedTask(
                            null,
                        )
                    }
                    onEdit={() =>
                        openEditTaskModal(
                            selectedTask,
                        )
                    }
                    onDelete={() =>
                        handleDeleteTask(
                            selectedTask.id,
                        )
                    }
                />
            )}

            {/* =================================================
          TASK FORM MODAL
      ================================================= */}

            {isModalOpen && (
                <TaskFormModal
                    isEditing={
                        editingTaskId !==
                        null
                    }
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
                    onClose={() =>
                        setIsModalOpen(
                            false,
                        )
                    }
                    onSave={
                        handleSaveTask
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
                />
            )}
        </div>
    );
}

/* =====================================================
   PROJECT INFO
===================================================== */

function ProjectInfo({
    icon,
    label,
    value,
}: ProjectInfoProps) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-[#e1e7e5] bg-[#f9faf9] p-4">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#e6f0ee] text-[#315b5d]">
                {icon}
            </div>

            <div>
                <p className="text-[10px] uppercase tracking-wide text-[#8a9b9b]">
                    {label}
                </p>

                <p className="mt-1 text-xs font-semibold text-[#29494a]">
                    {value}
                </p>
            </div>
        </div>
    );
}

/* =====================================================
   BOARD COLUMN
===================================================== */

function BoardColumn({
    id,
    title,
    tasks,
    onAddTask,
    onTaskClick,
}: BoardColumnProps) {
    const {
        setNodeRef,
        isOver,
    } = useDroppable({
        id,
    });

    return (
        <div
            ref={setNodeRef}
            className={`
        min-h-[500px]
        rounded-2xl
        border
        p-3
        transition
        ${isOver
                    ? "border-[#527273] bg-[#e8f0ee]"
                    : "border-[#e1e7e5] bg-[#eef2f1]/60"
                }
      `}
        >
            {/* HEADER */}

            <div className="mb-4 flex items-center justify-between px-2 pt-2">
                <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-[#29494a]">
                        {title}
                    </h2>

                    <span className="rounded-md bg-white px-2 py-0.5 text-[10px] text-[#849595]">
                        {tasks.length}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={
                        onAddTask
                    }
                    className="text-[#849595] transition hover:text-[#29494a]"
                >
                    <Plus size={17} />
                </button>
            </div>

            {/* SORTABLE */}

            <SortableContext
                items={tasks.map(
                    (task) => task.id,
                )}
                strategy={
                    verticalListSortingStrategy
                }
            >
                <div className="space-y-3">
                    {tasks.map(
                        (task) => (
                            <SortableTask
                                key={task.id}
                                task={task}
                                onClick={() =>
                                    onTaskClick(
                                        task,
                                    )
                                }
                            />
                        ),
                    )}
                </div>
            </SortableContext>

            {/* ADD TASK */}

            <button
                type="button"
                onClick={
                    onAddTask
                }
                className="mt-3 flex min-h-[80px] w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#cbd7d4] text-xs text-[#849595] transition hover:border-[#789b97] hover:bg-white/70"
            >
                <Plus size={16} />
                Add task
            </button>
        </div>
    );
}

/* =====================================================
   SORTABLE TASK
===================================================== */

function SortableTask({
    task,
    onClick,
}: {
    task: Task;
    onClick: () => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
    });

    const style = {
        transform:
            CSS.Transform.toString(
                transform,
            ),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={
                onClick
            }
            className={
                isDragging
                    ? "opacity-30"
                    : "cursor-grab active:cursor-grabbing"
            }
        >
            <TaskCard
                task={task}
                onClick={
                    onClick
                }
            />
        </div>
    );
}

/* =====================================================
   TASK CARD
===================================================== */

function TaskCard({
    task,
    isDragging = false,
    onClick,
}: {
    task: Task;
    isDragging?: boolean;
    onClick: () => void;
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
        <button
            type="button"
            onClick={
                onClick
            }
            className={`
        w-full
        rounded-xl
        border border-[#dde5e3]
        bg-white
        p-4
        text-left
        shadow-[0_2px_8px_rgba(25,60,60,0.05)]
        transition
        ${isDragging
                    ? "rotate-2 scale-[1.02] shadow-xl"
                    : "hover:-translate-y-0.5 hover:shadow-md"
                }
      `}
        >
            <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-[#29494a]">
                    {task.title}
                </p>

                <span
                    className={`
            rounded-md
            px-2 py-1
            text-[9px]
            font-medium
            ${priorityStyles[
                        task.priority
                        ]
                        }
          `}
                >
                    {task.priority}
                </span>
            </div>

            {task.description && (
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#849595]">
                    {
                        task.description
                    }
                </p>
            )}

            <div className="mt-5 flex items-center justify-between">
                <span className="text-[10px] text-[#8a9b9b]">
                    {task.dueDate ||
                        "No due date"}
                </span>

                <div className="grid h-6 w-6 place-items-center rounded-full bg-[#dcebea] text-[9px] font-semibold text-[#527273]">
                    {
                        task.assignee
                    }
                </div>
            </div>
        </button>
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
}: {
    task: Task;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#163536]/30 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-[#f9faf9] p-6 shadow-2xl">

                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs text-[#849595]">
                            TASK DETAILS
                        </p>

                        <h2 className="mt-2 text-xl font-semibold text-[#29494a]">
                            {
                                task.title
                            }
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={
                            onClose
                        }
                        className="grid h-9 w-9 place-items-center rounded-lg hover:bg-[#edf1f0]"
                    >
                        <X size={18} />
                    </button>
                </div>

                <p className="mt-6 text-sm leading-6 text-[#718282]">
                    {task.description ||
                        "No description added."}
                </p>

                <div className="mt-7 grid grid-cols-2 gap-4">
                    <DetailItem
                        label="Status"
                        value={
                            task.status
                        }
                    />

                    <DetailItem
                        label="Priority"
                        value={
                            task.priority
                        }
                    />

                    <DetailItem
                        label="Assignee"
                        value={
                            task.assignee
                        }
                    />

                    <DetailItem
                        label="Due Date"
                        value={
                            task.dueDate ||
                            "Not assigned"
                        }
                    />
                </div>

                <div className="mt-8 flex justify-between">
                    <button
                        type="button"
                        onClick={
                            onDelete
                        }
                        className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-[#c65b50] transition hover:bg-[#fdebea]"
                    >
                        <Trash2
                            size={16}
                        />
                        Delete
                    </button>

                    <button
                        type="button"
                        onClick={
                            onEdit
                        }
                        className="flex items-center gap-2 rounded-lg bg-[#214f51] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#183f41]"
                    >
                        <Edit3
                            size={16}
                        />
                        Edit task
                    </button>
                </div>
            </div>
        </div>
    );
}

/* =====================================================
   DETAIL ITEM
===================================================== */

function DetailItem({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-xl bg-white p-3">
            <p className="text-[10px] uppercase tracking-wide text-[#8a9b9b]">
                {label}
            </p>

            <p className="mt-1 text-sm font-medium capitalize text-[#29494a]">
                {value}
            </p>
        </div>
    );
}

/* =====================================================
   TASK FORM MODAL
===================================================== */

function TaskFormModal({
    isEditing,
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
    isEditing: boolean;
    taskTitle: string;
    taskDescription: string;
    taskStatus: TaskStatus;
    taskPriority: TaskPriority;
    taskDueDate: string;
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
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#163536]/30 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-[#f9faf9] p-6 shadow-2xl">

                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-[#29494a]">
                            {isEditing
                                ? "Edit Task"
                                : "Create Task"}
                        </h2>

                        <p className="mt-1 text-xs text-[#849595]">
                            Manage your project task.
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
                        placeholder="What needs to be done?"
                        className="mt-2 w-full rounded-xl border border-[#dce4e2] bg-white px-4 py-3 text-sm text-[#29494a] outline-none placeholder:text-[#a7b3b3] focus:border-[#527273]"
                    />
                </div>

                {/* DESCRIPTION */}

                <div className="mt-5">
                    <label className="text-xs font-medium text-[#527273]">
                        Description
                    </label>

                    <textarea
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
                        rows={4}
                        placeholder="Add task details..."
                        className="mt-2 w-full resize-none rounded-xl border border-[#dce4e2] bg-white px-4 py-3 text-sm text-[#29494a] outline-none placeholder:text-[#a7b3b3] focus:border-[#527273]"
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
                                Done
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
                            <option value="low">
                                Low
                            </option>

                            <option value="medium">
                                Medium
                            </option>

                            <option value="high">
                                High
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

                <div className="mt-7 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={
                            onClose
                        }
                        className="rounded-lg px-4 py-2.5 text-sm font-medium text-[#718282] transition hover:bg-[#edf1f0]"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={
                            onSave
                        }
                        className="rounded-lg bg-[#214f51] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#183f41]"
                    >
                        {isEditing
                            ? "Save Changes"
                            : "Create Task"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Projects;