import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    closestCorners,
    DndContext,
    DragOverlay,
    PointerSensor,
    useDroppable,
    useSensor,
    useSensors,
} from "@dnd-kit/core";

import type {
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
} from "@dnd-kit/core";

import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import {
    ArrowLeft,
    CalendarDays,
    Clock3,
    Edit3,
    Filter,
    GripVertical,
    Plus,
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
    dueDate: string;
    assignee: string;
    order: number;
}

interface Project {
    id: string;
    name: string;
    description: string;
    status: "active" | "completed" | "on-hold";
    progress: number;
    dueDate: string;
    members: string[];
    taskCount: number;
}

interface TaskFormData {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
    assignee: string;
}

/* =====================================================
   CONSTANTS
===================================================== */

const columns: {
    id: TaskStatus;
    title: string;
    description: string;
}[] = [
        {
            id: "todo",
            title: "To Do",
            description: "Tasks waiting to be started",
        },
        {
            id: "progress",
            title: "In Progress",
            description: "Tasks currently being worked on",
        },
        {
            id: "done",
            title: "Done",
            description: "Successfully completed tasks",
        },
    ];

const initialFormData: TaskFormData = {
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
    assignee: "",
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function ProjectBoard() {
    const navigate = useNavigate();

    const { projectId } = useParams<{
        projectId: string;
    }>();

    /* =====================================================
       DND SENSORS
    ===================================================== */

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
    );

    /* =====================================================
       SEARCH & FILTER STATES
    ===================================================== */

    const [searchTerm, setSearchTerm] = useState("");

    const [statusFilter, setStatusFilter] = useState<
        "all" | TaskStatus
    >("all");

    const [priorityFilter, setPriorityFilter] = useState<
        "all" | TaskPriority
    >("all");

    /* =====================================================
       MODAL STATES
    ===================================================== */

    const [isTaskModalOpen, setIsTaskModalOpen] =
        useState(false);

    const [isDetailsModalOpen, setIsDetailsModalOpen] =
        useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] =
        useState(false);

    const [editingTask, setEditingTask] =
        useState<Task | null>(null);

    const [selectedTask, setSelectedTask] =
        useState<Task | null>(null);

    const [formData, setFormData] =
        useState<TaskFormData>(
            initialFormData,
        );

    /* =====================================================
       PROJECT DATA
    ===================================================== */

    const [projects] = useState<Project[]>(() => {
        const savedProjects =
            localStorage.getItem("trackly-projects");

        if (savedProjects) {
            try {
                return JSON.parse(savedProjects);
            } catch {
                return [];
            }
        }

        return [];
    });

    const project = useMemo(() => {
        return projects.find(
            (item) => item.id === projectId,
        );
    }, [projects, projectId]);

    /* =====================================================
       TASK DATA
    ===================================================== */

    const [tasks, setTasks] = useState<Task[]>(() => {
        const savedTasks =
            localStorage.getItem("trackly-board-tasks");

        if (savedTasks) {
            try {
                return JSON.parse(savedTasks);
            } catch {
                return [];
            }
        }

        return [];
    });

    const [activeTask, setActiveTask] =
        useState<Task | null>(null);

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
       PROJECT TASKS
    ===================================================== */

    const projectTasks = useMemo(() => {
        return tasks.filter(
            (task) => task.projectId === projectId,
        );
    }, [tasks, projectId]);

    /* =====================================================
       FILTERED TASKS
    ===================================================== */

    const filteredProjectTasks = useMemo(() => {
        return projectTasks.filter((task) => {
            const search = searchTerm
                .trim()
                .toLowerCase();

            const matchesSearch =
                !search ||
                task.title
                    .toLowerCase()
                    .includes(search) ||
                task.description
                    .toLowerCase()
                    .includes(search) ||
                task.assignee
                    .toLowerCase()
                    .includes(search);

            const matchesStatus =
                statusFilter === "all" ||
                task.status === statusFilter;

            const matchesPriority =
                priorityFilter === "all" ||
                task.priority === priorityFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority
            );
        });
    }, [
        projectTasks,
        searchTerm,
        statusFilter,
        priorityFilter,
    ]);

    /* =====================================================
       CHECK IF FILTERING
    ===================================================== */

    const isFiltering =
        searchTerm.trim() !== "" ||
        statusFilter !== "all" ||
        priorityFilter !== "all";

    /* =====================================================
       GET TASKS BY STATUS
    ===================================================== */

    function getTasksByStatus(
        status: TaskStatus,
    ) {
        return filteredProjectTasks
            .filter(
                (task) =>
                    task.status === status,
            )
            .sort(
                (a, b) =>
                    a.order - b.order,
            );
    }

    /* =====================================================
       NORMALIZE TASK ORDERS
    ===================================================== */

    function normalizeTaskOrders(
        updatedTasks: Task[],
    ) {
        const result = [...updatedTasks];

        columns.forEach((column) => {
            const columnTasks = result
                .filter(
                    (task) =>
                        task.projectId === projectId &&
                        task.status === column.id,
                )
                .sort(
                    (a, b) =>
                        a.order - b.order,
                );

            columnTasks.forEach(
                (task, index) => {
                    const taskIndex =
                        result.findIndex(
                            (item) =>
                                item.id === task.id,
                        );

                    if (taskIndex !== -1) {
                        result[taskIndex] = {
                            ...result[taskIndex],
                            order: index,
                        };
                    }
                },
            );
        });

        return result;
    }

    /* =====================================================
       TASK CRUD
    ===================================================== */

    function openCreateTaskModal(
        status: TaskStatus = "todo",
    ) {
        setEditingTask(null);

        setFormData({
            ...initialFormData,
            status,
        });

        setIsTaskModalOpen(true);
    }

    function openEditTaskModal(
        task: Task,
    ) {
        setEditingTask(task);

        setFormData({
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate,
            assignee: task.assignee,
        });

        setIsDetailsModalOpen(false);

        setIsTaskModalOpen(true);
    }

    function closeTaskModal() {
        setIsTaskModalOpen(false);
        setEditingTask(null);
        setFormData(initialFormData);
    }

    function handleFormChange(
        event: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    function handleTaskSubmit(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        if (!projectId) return;

        if (!formData.title.trim()) {
            return;
        }

        /* EDIT TASK */

        if (editingTask) {
            setTasks((previousTasks) => {
                const updatedTasks =
                    previousTasks.map((task) =>
                        task.id === editingTask.id
                            ? {
                                ...task,
                                title:
                                    formData.title.trim(),
                                description:
                                    formData.description.trim(),
                                status:
                                    formData.status,
                                priority:
                                    formData.priority,
                                dueDate:
                                    formData.dueDate,
                                assignee:
                                    formData.assignee.trim(),
                            }
                            : task,
                    );

                return normalizeTaskOrders(
                    updatedTasks,
                );
            });

            closeTaskModal();

            return;
        }

        /* CREATE TASK */

        const existingTasksInColumn =
            projectTasks.filter(
                (task) =>
                    task.status ===
                    formData.status,
            );

        const newTask: Task = {
            id:
                typeof crypto !== "undefined" &&
                    crypto.randomUUID
                    ? crypto.randomUUID()
                    : Date.now().toString(),

            projectId,

            title:
                formData.title.trim(),

            description:
                formData.description.trim(),

            status:
                formData.status,

            priority:
                formData.priority,

            dueDate:
                formData.dueDate,

            assignee:
                formData.assignee.trim(),

            order:
                existingTasksInColumn.length,
        };

        setTasks((previousTasks) => [
            ...previousTasks,
            newTask,
        ]);

        closeTaskModal();
    }

    function openTaskDetails(
        task: Task,
    ) {
        setSelectedTask(task);
        setIsDetailsModalOpen(true);
    }

    function closeTaskDetails() {
        setSelectedTask(null);
        setIsDetailsModalOpen(false);
    }

    function openDeleteModal(
        task: Task,
    ) {
        setSelectedTask(task);
        setIsDetailsModalOpen(false);
        setIsDeleteModalOpen(true);
    }

    function handleDeleteTask() {
        if (!selectedTask) return;

        setTasks((previousTasks) => {
            const updatedTasks =
                previousTasks.filter(
                    (task) =>
                        task.id !== selectedTask.id,
                );

            return normalizeTaskOrders(
                updatedTasks,
            );
        });

        setSelectedTask(null);

        setIsDeleteModalOpen(false);
    }

    /* =====================================================
       DND HELPERS
    ===================================================== */

    function findTask(id: string) {
        return tasks.find(
            (task) => task.id === id,
        );
    }

    function isColumnId(id: string) {
        return columns.some(
            (column) => column.id === id,
        );
    }

    /* =====================================================
       DRAG START
    ===================================================== */

    function handleDragStart(
        event: DragStartEvent,
    ) {
        const task = findTask(
            event.active.id.toString(),
        );

        if (task) {
            setActiveTask(task);
        }
    }

    /* =====================================================
       DRAG OVER
    ===================================================== */

    function handleDragOver(
        event: DragOverEvent,
    ) {
        const { active, over } = event;

        if (!over) return;

        const activeId =
            active.id.toString();

        const overId =
            over.id.toString();

        const activeTaskItem =
            findTask(activeId);

        if (!activeTaskItem) return;

        /* OVER COLUMN */

        if (isColumnId(overId)) {
            const newStatus =
                overId as TaskStatus;

            if (
                activeTaskItem.status ===
                newStatus
            ) {
                return;
            }

            setTasks((previousTasks) => {
                const targetColumnCount =
                    previousTasks.filter(
                        (task) =>
                            task.projectId ===
                            projectId &&
                            task.status ===
                            newStatus,
                    ).length;

                const updatedTasks =
                    previousTasks.map((task) =>
                        task.id === activeId
                            ? {
                                ...task,
                                status: newStatus,
                                order:
                                    targetColumnCount,
                            }
                            : task,
                    );

                return normalizeTaskOrders(
                    updatedTasks,
                );
            });

            return;
        }

        /* OVER ANOTHER TASK */

        const overTask =
            findTask(overId);

        if (!overTask) return;

        if (
            activeTaskItem.status ===
            overTask.status
        ) {
            return;
        }

        /* MOVE BETWEEN COLUMNS */

        setTasks((previousTasks) => {
            const updatedTasks =
                previousTasks.map((task) =>
                    task.id === activeId
                        ? {
                            ...task,
                            status:
                                overTask.status,
                            order:
                                overTask.order,
                        }
                        : task,
                );

            return normalizeTaskOrders(
                updatedTasks,
            );
        });
    }

    /* =====================================================
       DRAG END
    ===================================================== */

    function handleDragEnd(
        event: DragEndEvent,
    ) {
        const { active, over } = event;

        setActiveTask(null);

        if (!over) return;

        const activeId =
            active.id.toString();

        const overId =
            over.id.toString();

        const activeTaskItem =
            findTask(activeId);

        if (!activeTaskItem) return;

        /* DROP INTO COLUMN */

        if (isColumnId(overId)) {
            const newStatus =
                overId as TaskStatus;

            setTasks((previousTasks) => {
                const updatedTasks =
                    previousTasks.map((task) =>
                        task.id === activeId
                            ? {
                                ...task,
                                status: newStatus,
                            }
                            : task,
                    );

                return normalizeTaskOrders(
                    updatedTasks,
                );
            });

            return;
        }

        const overTask =
            findTask(overId);

        if (!overTask) return;

        /* REORDER SAME COLUMN */

        if (
            activeTaskItem.status ===
            overTask.status
        ) {
            const columnTasks =
                projectTasks
                    .filter(
                        (task) =>
                            task.status ===
                            activeTaskItem.status,
                    )
                    .sort(
                        (a, b) =>
                            a.order - b.order,
                    );

            const oldIndex =
                columnTasks.findIndex(
                    (task) =>
                        task.id === activeId,
                );

            const newIndex =
                columnTasks.findIndex(
                    (task) =>
                        task.id === overId,
                );

            if (
                oldIndex === -1 ||
                newIndex === -1
            ) {
                return;
            }

            const reorderedTasks =
                arrayMove(
                    columnTasks,
                    oldIndex,
                    newIndex,
                );

            setTasks((previousTasks) => {
                return previousTasks.map(
                    (task) => {
                        const index =
                            reorderedTasks.findIndex(
                                (item) =>
                                    item.id === task.id,
                            );

                        if (index !== -1) {
                            return {
                                ...task,
                                order: index,
                            };
                        }

                        return task;
                    },
                );
            });

            return;
        }

        /* FINAL CROSS COLUMN UPDATE */

        setTasks((previousTasks) => {
            const updatedTasks =
                previousTasks.map((task) =>
                    task.id === activeId
                        ? {
                            ...task,
                            status:
                                overTask.status,
                        }
                        : task,
                );

            return normalizeTaskOrders(
                updatedTasks,
            );
        });
    }

    /* =====================================================
       PROJECT NOT FOUND
    ===================================================== */

    if (!project) {
        return (
            <div className="py-16 text-center">
                <h1 className="text-2xl font-semibold text-[#29494a]">
                    Project not found
                </h1>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/projects")
                    }
                    className="mt-5 rounded-xl bg-[#214f51] px-5 py-3 text-sm text-white"
                >
                    Back to Projects
                </button>
            </div>
        );
    }

    /* =====================================================
       MAIN UI
    ===================================================== */

    return (
        <div className="mx-auto max-w-[1450px]">

            {/* HEADER */}

            <div className="mb-8">
                <button
                    type="button"
                    onClick={() =>
                        navigate("/projects")
                    }
                    className="mb-5 flex items-center gap-2 text-sm text-[#849595]"
                >
                    <ArrowLeft size={17} />
                    Back to Projects
                </button>

                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[#849595]">
                            Project Workspace
                        </p>

                        <h1 className="mt-2 text-3xl font-semibold text-[#29494a]">
                            {project.name}
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm text-[#849595]">
                            {project.description}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            openCreateTaskModal()
                        }
                        className="flex items-center justify-center gap-2 rounded-xl bg-[#214f51] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#173d3f]"
                    >
                        <Plus size={18} />
                        Add Task
                    </button>

                </div>
            </div>

            {/* SEARCH & FILTER */}

            <div className="mb-4 rounded-2xl border border-[#e1e7e5] bg-white p-4">

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    {/* SEARCH */}

                    <div className="relative w-full lg:max-w-md">

                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a9b9b]"
                        />

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(
                                    event.target.value,
                                )
                            }
                            placeholder="Search tasks..."
                            className="w-full rounded-xl border border-[#dce4e2] bg-[#fafcfc] py-3 pl-11 pr-10 text-sm text-[#29494a] outline-none transition placeholder:text-[#a1afad] focus:border-[#527273]"
                        />

                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() =>
                                    setSearchTerm("")
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#849595] hover:text-[#29494a]"
                            >
                                <X size={16} />
                            </button>
                        )}

                    </div>

                    {/* FILTERS */}

                    <div className="flex flex-wrap items-center gap-3">

                        <div className="flex items-center gap-2 text-[#718282]">
                            <Filter size={17} />

                            <span className="text-sm font-medium">
                                Filter
                            </span>
                        </div>

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
                            className="rounded-xl border border-[#dce4e2] bg-white px-4 py-3 text-sm text-[#527273] outline-none focus:border-[#527273]"
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
                            className="rounded-xl border border-[#dce4e2] bg-white px-4 py-3 text-sm text-[#527273] outline-none focus:border-[#527273]"
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

                        {isFiltering && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchTerm("");
                                    setStatusFilter("all");
                                    setPriorityFilter("all");
                                }}
                                className="rounded-xl px-3 py-3 text-sm font-medium text-[#527273] hover:bg-[#edf3f1]"
                            >
                                Clear
                            </button>
                        )}

                    </div>
                </div>
            </div>

            {/* TASK COUNT */}

            <div className="mb-5 flex items-center justify-between">

                <p className="text-sm text-[#849595]">
                    Showing{" "}

                    <span className="font-semibold text-[#29494a]">
                        {filteredProjectTasks.length}
                    </span>

                    {" "}of{" "}

                    <span className="font-semibold text-[#29494a]">
                        {projectTasks.length}
                    </span>

                    {" "}tasks
                </p>

                {isFiltering && (
                    <p className="hidden text-xs text-[#849595] md:block">
                        Clear filters to reorder or move tasks.
                    </p>
                )}

            </div>

            {/* KANBAN */}

            <DndContext
                sensors={
                    isFiltering
                        ? []
                        : sensors
                }
                collisionDetection={
                    closestCorners
                }
                onDragStart={
                    isFiltering
                        ? undefined
                        : handleDragStart
                }
                onDragOver={
                    isFiltering
                        ? undefined
                        : handleDragOver
                }
                onDragEnd={
                    isFiltering
                        ? undefined
                        : handleDragEnd
                }
            >

                <div className="overflow-x-auto pb-3">

                    <div className="grid min-w-[900px] grid-cols-3 gap-5">

                        {columns.map(
                            (column) => (
                                <KanbanColumn
                                    key={column.id}
                                    column={column}
                                    tasks={getTasksByStatus(
                                        column.id,
                                    )}
                                    dragDisabled={
                                        isFiltering
                                    }
                                    onAddTask={() =>
                                        openCreateTaskModal(
                                            column.id,
                                        )
                                    }
                                    onTaskClick={
                                        openTaskDetails
                                    }
                                />
                            ),
                        )}

                    </div>

                </div>

                <DragOverlay>
                    {activeTask ? (
                        <TaskCard
                            task={activeTask}
                            overlay
                        />
                    ) : null}
                </DragOverlay>

            </DndContext>

            {/* TASK FORM MODAL */}

            {isTaskModalOpen && (
                <TaskFormModal
                    formData={formData}
                    editingTask={editingTask}
                    onClose={closeTaskModal}
                    onChange={handleFormChange}
                    onSubmit={handleTaskSubmit}
                />
            )}

            {/* TASK DETAILS MODAL */}

            {isDetailsModalOpen &&
                selectedTask && (
                    <TaskDetailsModal
                        task={selectedTask}
                        onClose={
                            closeTaskDetails
                        }
                        onEdit={() =>
                            openEditTaskModal(
                                selectedTask,
                            )
                        }
                        onDelete={() =>
                            openDeleteModal(
                                selectedTask,
                            )
                        }
                    />
                )}

            {/* DELETE CONFIRMATION MODAL */}

            {isDeleteModalOpen &&
                selectedTask && (
                    <DeleteConfirmationModal
                        task={selectedTask}
                        onCancel={() => {
                            setIsDeleteModalOpen(
                                false,
                            );
                        }}
                        onConfirm={
                            handleDeleteTask
                        }
                    />
                )}

        </div>
    );
}

/* =====================================================
   KANBAN COLUMN
===================================================== */

function KanbanColumn({
    column,
    tasks,
    dragDisabled,
    onAddTask,
    onTaskClick,
}: {
    column: {
        id: TaskStatus;
        title: string;
        description: string;
    };
    tasks: Task[];
    dragDisabled: boolean;
    onAddTask: () => void;
    onTaskClick: (task: Task) => void;
}) {

    const {
        setNodeRef,
        isOver,
    } = useDroppable({
        id: column.id,
        disabled: dragDisabled,
    });

    return (
        <div
            ref={setNodeRef}
            className={`min-h-[520px] rounded-2xl border p-4 transition ${isOver
                ? "border-[#527273] bg-[#eef5f3]"
                : "border-[#e1e7e5] bg-[#f5f7f6]"
                }`}
        >

            {/* COLUMN HEADER */}

            <div className="mb-5">

                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                        <h2 className="text-sm font-semibold text-[#29494a]">
                            {column.title}
                        </h2>

                        <span className="rounded-md bg-white px-2 py-1 text-xs text-[#849595]">
                            {tasks.length}
                        </span>

                    </div>

                    <button
                        type="button"
                        onClick={onAddTask}
                        className="grid h-7 w-7 place-items-center rounded-lg text-[#527273] transition hover:bg-white"
                    >
                        <Plus size={16} />
                    </button>

                </div>

                <p className="mt-1 text-[11px] text-[#849595]">
                    {column.description}
                </p>

            </div>

            {/* TASKS */}

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
                                disabled={
                                    dragDisabled
                                }
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

            {/* EMPTY STATE */}

            {tasks.length === 0 && (
                <div className="grid min-h-[180px] place-items-center rounded-xl border border-dashed border-[#d7e0dd] bg-white/40">

                    <p className="text-xs text-[#9aa8a7]">
                        {dragDisabled
                            ? "No matching tasks"
                            : "Drop task here"}
                    </p>

                </div>
            )}

        </div>
    );
}

/* =====================================================
   SORTABLE TASK
===================================================== */

function SortableTask({
    task,
    disabled,
    onClick,
}: {
    task: Task;
    disabled: boolean;
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
        disabled,
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
                isDragging
                    ? undefined
                    : onClick
            }
            className={
                isDragging
                    ? "cursor-grabbing opacity-40"
                    : disabled
                        ? "cursor-default"
                        : "cursor-grab active:cursor-grabbing"
            }
        >
            <TaskCard
                task={task}
            />
        </div>
    );
}

/* =====================================================
   TASK CARD
===================================================== */

function TaskCard({
    task,
    overlay = false,
}: {
    task: Task;
    overlay?: boolean;
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
        <article
            className={`rounded-xl border border-[#e1e7e5] bg-white p-4 shadow-sm transition ${overlay
                ? "rotate-2 shadow-xl"
                : "hover:-translate-y-[1px] hover:shadow-md"
                }`}
        >

            <div className="flex items-start justify-between gap-3">

                <div className="min-w-0">

                    <h3 className="truncate text-sm font-semibold text-[#29494a]">
                        {task.title}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#849595]">
                        {task.description}
                    </p>

                </div>

                <GripVertical
                    size={17}
                    className="shrink-0 text-[#a5b1af]"
                />

            </div>

            <div className="mt-4 flex items-center justify-between gap-2">

                <span
                    className={`rounded-md px-2 py-1 text-[10px] font-medium capitalize ${priorityStyles[
                        task.priority
                    ]
                        }`}
                >
                    {task.priority}
                </span>

                <div className="flex items-center gap-2">

                    {task.dueDate && (
                        <div className="flex items-center gap-1 text-[10px] text-[#849595]">

                            <Clock3 size={12} />

                            {task.dueDate}

                        </div>
                    )}

                    {task.assignee && (
                        <div className="grid h-7 min-w-7 place-items-center rounded-full bg-[#dfeae7] px-2 text-[9px] font-semibold text-[#527273]">

                            {task.assignee}

                        </div>
                    )}

                </div>

            </div>

        </article>
    );
}

/* =====================================================
   TASK FORM MODAL
===================================================== */

function TaskFormModal({
    formData,
    editingTask,
    onClose,
    onChange,
    onSubmit,
}: {
    formData: TaskFormData;
    editingTask: Task | null;
    onClose: () => void;
    onChange: (
        event: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => void;
    onSubmit: (
        event: React.FormEvent<HTMLFormElement>,
    ) => void;
}) {

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102827]/40 p-4 backdrop-blur-sm">

            <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">

                {/* HEADER */}

                <div className="flex items-center justify-between border-b border-[#e7ecea] px-6 py-5">

                    <div>
                        <h2 className="text-lg font-semibold text-[#29494a]">
                            {editingTask
                                ? "Edit Task"
                                : "Create New Task"}
                        </h2>

                        <p className="mt-1 text-sm text-[#849595]">
                            {editingTask
                                ? "Update your task information."
                                : "Add a new task to your project."}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-[#849595] hover:bg-[#f3f6f5]"
                    >
                        <X size={18} />
                    </button>

                </div>

                {/* FORM */}

                <form
                    onSubmit={onSubmit}
                    className="p-6"
                >

                    <div className="space-y-5">

                        {/* TITLE */}

                        <div>
                            <label className="mb-2 block text-sm font-medium text-[#405858]">
                                Task Title *
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={onChange}
                                placeholder="Enter task title"
                                required
                                className="w-full rounded-xl border border-[#dce4e2] px-4 py-3 text-sm outline-none transition focus:border-[#527273]"
                            />
                        </div>

                        {/* DESCRIPTION */}

                        <div>
                            <label className="mb-2 block text-sm font-medium text-[#405858]">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={onChange}
                                placeholder="Describe this task..."
                                rows={4}
                                className="w-full resize-none rounded-xl border border-[#dce4e2] px-4 py-3 text-sm outline-none transition focus:border-[#527273]"
                            />
                        </div>

                        {/* STATUS + PRIORITY */}

                        <div className="grid gap-5 md:grid-cols-2">

                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#405858]">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={onChange}
                                    className="w-full rounded-xl border border-[#dce4e2] bg-white px-4 py-3 text-sm outline-none focus:border-[#527273]"
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
                                <label className="mb-2 block text-sm font-medium text-[#405858]">
                                    Priority
                                </label>

                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={onChange}
                                    className="w-full rounded-xl border border-[#dce4e2] bg-white px-4 py-3 text-sm outline-none focus:border-[#527273]"
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

                        {/* DATE + ASSIGNEE */}

                        <div className="grid gap-5 md:grid-cols-2">

                            <div>
                                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[#405858]">

                                    <CalendarDays size={15} />

                                    Due Date

                                </label>

                                <input
                                    type="date"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={onChange}
                                    className="w-full rounded-xl border border-[#dce4e2] px-4 py-3 text-sm outline-none focus:border-[#527273]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#405858]">
                                    Assignee
                                </label>

                                <input
                                    type="text"
                                    name="assignee"
                                    value={formData.assignee}
                                    onChange={onChange}
                                    placeholder="Enter assignee name"
                                    className="w-full rounded-xl border border-[#dce4e2] px-4 py-3 text-sm outline-none focus:border-[#527273]"
                                />
                            </div>

                        </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="mt-8 flex justify-end gap-3 border-t border-[#e7ecea] pt-5">

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl px-5 py-3 text-sm font-medium text-[#527273] hover:bg-[#f1f5f3]"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded-xl bg-[#214f51] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#173d3f]"
                        >
                            {editingTask
                                ? "Save Changes"
                                : "Create Task"}
                        </button>

                    </div>

                </form>

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
}: {
    task: Task;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102827]/40 p-4 backdrop-blur-sm">

            <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">

                {/* HEADER */}

                <div className="flex items-start justify-between border-b border-[#e7ecea] px-6 py-5">

                    <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-[#849595]">
                            Task Details
                        </p>

                        <h2 className="mt-2 text-xl font-semibold text-[#29494a]">
                            {task.title}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-[#849595] hover:bg-[#f3f6f5]"
                    >
                        <X size={18} />
                    </button>

                </div>

                {/* CONTENT */}

                <div className="space-y-6 p-6">

                    <div>
                        <p className="text-sm leading-6 text-[#718282]">
                            {task.description ||
                                "No description added for this task."}
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">

                        <DetailItem
                            label="Status"
                            value={
                                task.status === "todo"
                                    ? "To Do"
                                    : task.status === "progress"
                                        ? "In Progress"
                                        : "Completed"
                            }
                        />

                        <div>
                            <p className="text-xs text-[#849595]">
                                Priority
                            </p>

                            <span
                                className={`mt-2 inline-flex rounded-lg px-3 py-1.5 text-xs font-medium capitalize ${priorityStyles[
                                    task.priority
                                ]
                                    }`}
                            >
                                {task.priority}
                            </span>
                        </div>

                        <DetailItem
                            label="Due Date"
                            value={
                                task.dueDate ||
                                "No due date"
                            }
                        />

                        <DetailItem
                            label="Assignee"
                            value={
                                task.assignee ||
                                "Unassigned"
                            }
                        />

                    </div>

                </div>

                {/* ACTIONS */}

                <div className="flex items-center justify-between border-t border-[#e7ecea] px-6 py-5">

                    <button
                        type="button"
                        onClick={onDelete}
                        className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-[#b85d4c] hover:bg-[#fff3f0]"
                    >
                        <Trash2 size={16} />
                        Delete
                    </button>

                    <div className="flex gap-3">

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl px-4 py-2.5 text-sm font-medium text-[#527273] hover:bg-[#f1f5f3]"
                        >
                            Close
                        </button>

                        <button
                            type="button"
                            onClick={onEdit}
                            className="flex items-center gap-2 rounded-xl bg-[#214f51] px-5 py-2.5 text-sm font-medium text-white"
                        >
                            <Edit3 size={16} />
                            Edit Task
                        </button>

                    </div>

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
        <div>
            <p className="text-xs text-[#849595]">
                {label}
            </p>

            <p className="mt-2 text-sm font-medium text-[#405858]">
                {value}
            </p>
        </div>
    );
}

/* =====================================================
   DELETE CONFIRMATION MODAL
===================================================== */

function DeleteConfirmationModal({
    task,
    onCancel,
    onConfirm,
}: {
    task: Task;
    onCancel: () => void;
    onConfirm: () => void;
}) {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#102827]/40 p-4 backdrop-blur-sm">

            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#fff0ec] text-[#b85d4c]">

                    <Trash2 size={20} />

                </div>

                <h2 className="mt-5 text-lg font-semibold text-[#29494a]">
                    Delete task?
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#849595]">
                    Are you sure you want to delete{" "}
                    <span className="font-medium text-[#405858]">
                        {task.title}
                    </span>
                    ? This action cannot be undone.
                </p>

                <div className="mt-7 flex justify-end gap-3">

                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-xl px-4 py-2.5 text-sm font-medium text-[#527273] hover:bg-[#f1f5f3]"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className="rounded-xl bg-[#b85d4c] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                    >
                        Delete Task
                    </button>

                </div>

            </div>
        </div>
    );
}