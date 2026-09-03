import { useEffect, useMemo, useState } from "react";
import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    FolderKanban,
    MoreHorizontal,
    Plus,
    Search,
    Trash2,
    Users,
    X,
    Pencil,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* =====================================================
   TYPES
===================================================== */

type ProjectStatus = "active" | "completed" | "on-hold";

interface Project {
    id: string;
    name: string;
    description: string;
    status: ProjectStatus;
    progress: number;
    dueDate: string;
    members: string[];
    taskCount: number;
}

/* =====================================================
   INITIAL PROJECT DATA
===================================================== */

const initialProjects: Project[] = [
    {
        id: "website-redesign",
        name: "Website Redesign",
        description:
            "Redesign the company website with a modern and improved user experience.",
        status: "active",
        progress: 72,
        dueDate: "2026-09-15",
        members: ["M", "A", "R"],
        taskCount: 12,
    },
    {
        id: "mobile-app",
        name: "Mobile App Design",
        description:
            "Design and develop the mobile application experience for customers.",
        status: "active",
        progress: 45,
        dueDate: "2026-09-25",
        members: ["M", "S", "J"],
        taskCount: 8,
    },
    {
        id: "marketing-campaign",
        name: "Marketing Campaign",
        description:
            "Prepare campaign assets and plan the upcoming product launch.",
        status: "on-hold",
        progress: 30,
        dueDate: "2026-10-05",
        members: ["A", "R"],
        taskCount: 6,
    },
    {
        id: "design-system",
        name: "Design System",
        description:
            "Build reusable design components and establish visual guidelines.",
        status: "completed",
        progress: 100,
        dueDate: "2026-08-30",
        members: ["M", "A", "R", "S"],
        taskCount: 18,
    },
];

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function Projects() {
    const navigate = useNavigate();

    const [projects, setProjects] = useState<Project[]>(() => {
        const savedProjects = localStorage.getItem(
            "trackly-projects",
        );

        if (savedProjects) {
            try {
                return JSON.parse(savedProjects);
            } catch {
                return initialProjects;
            }
        }

        return initialProjects;
    });

    const [searchQuery, setSearchQuery] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState<"all" | ProjectStatus>("all");

    const [showProjectModal, setShowProjectModal] =
        useState(false);

    const [editingProject, setEditingProject] =
        useState<Project | null>(null);

    const [menuProjectId, setMenuProjectId] =
        useState<string | null>(null);

    /* =====================================================
       FORM STATE
    ===================================================== */

    const [projectName, setProjectName] =
        useState("");

    const [projectDescription, setProjectDescription] =
        useState("");

    const [projectStatus, setProjectStatus] =
        useState<ProjectStatus>("active");

    const [projectProgress, setProjectProgress] =
        useState(0);

    const [projectDueDate, setProjectDueDate] =
        useState("");

    /* =====================================================
       LOCAL STORAGE
    ===================================================== */

    useEffect(() => {
        localStorage.setItem(
            "trackly-projects",
            JSON.stringify(projects),
        );
    }, [projects]);

    /* =====================================================
       FILTER PROJECTS
    ===================================================== */

    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            const searchMatches =
                project.name
                    .toLowerCase()
                    .includes(
                        searchQuery.toLowerCase(),
                    ) ||
                project.description
                    .toLowerCase()
                    .includes(
                        searchQuery.toLowerCase(),
                    );

            const statusMatches =
                statusFilter === "all" ||
                project.status === statusFilter;

            return (
                searchMatches &&
                statusMatches
            );
        });
    }, [
        projects,
        searchQuery,
        statusFilter,
    ]);

    /* =====================================================
       STATISTICS
    ===================================================== */

    const statistics = useMemo(() => {
        const total = projects.length;

        const active = projects.filter(
            (project) =>
                project.status === "active",
        ).length;

        const completed = projects.filter(
            (project) =>
                project.status === "completed",
        ).length;

        const onHold = projects.filter(
            (project) =>
                project.status === "on-hold",
        ).length;

        return {
            total,
            active,
            completed,
            onHold,
        };
    }, [projects]);

    /* =====================================================
       OPEN CREATE MODAL
    ===================================================== */

    function openCreateProject() {
        setEditingProject(null);

        setProjectName("");
        setProjectDescription("");
        setProjectStatus("active");
        setProjectProgress(0);
        setProjectDueDate("");

        setShowProjectModal(true);
    }

    /* =====================================================
       OPEN EDIT MODAL
    ===================================================== */

    function openEditProject(
        project: Project,
    ) {
        setEditingProject(project);

        setProjectName(project.name);

        setProjectDescription(
            project.description,
        );

        setProjectStatus(
            project.status,
        );

        setProjectProgress(
            project.progress,
        );

        setProjectDueDate(
            project.dueDate,
        );

        setShowProjectModal(true);

        setMenuProjectId(null);
    }

    /* =====================================================
       SAVE PROJECT
    ===================================================== */

    function saveProject() {
        if (!projectName.trim()) return;

        if (editingProject) {
            setProjects(
                (previousProjects) =>
                    previousProjects.map(
                        (project) =>
                            project.id ===
                                editingProject.id
                                ? {
                                    ...project,
                                    name:
                                        projectName.trim(),
                                    description:
                                        projectDescription.trim(),
                                    status:
                                        projectStatus,
                                    progress:
                                        Number(
                                            projectProgress,
                                        ),
                                    dueDate:
                                        projectDueDate,
                                }
                                : project,
                    ),
            );
        } else {
            const newProject: Project = {
                id: `${projectName
                    .toLowerCase()
                    .replace(/\s+/g, "-")}-${Date.now()}`,
                name: projectName.trim(),
                description:
                    projectDescription.trim(),
                status: projectStatus,
                progress: Number(
                    projectProgress,
                ),
                dueDate: projectDueDate,
                members: ["M"],
                taskCount: 0,
            };

            setProjects(
                (previousProjects) => [
                    newProject,
                    ...previousProjects,
                ],
            );
        }

        setShowProjectModal(false);
    }

    /* =====================================================
       DELETE PROJECT
    ===================================================== */

    function deleteProject(
        projectId: string,
    ) {
        const shouldDelete =
            window.confirm(
                "Are you sure you want to delete this project?",
            );

        if (!shouldDelete) return;

        setProjects(
            (previousProjects) =>
                previousProjects.filter(
                    (project) =>
                        project.id !== projectId,
                ),
        );

        setMenuProjectId(null);
    }

    /* =====================================================
       FORMAT DATE
    ===================================================== */

    function formatDate(date: string) {
        if (!date) return "No due date";

        return new Date(
            `${date}T00:00:00`,
        ).toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric",
            },
        );
    }

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div className="mx-auto max-w-[1250px]">

            {/* HEADER */}

            <section className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#849595]">
                        Workspace
                    </p>

                    <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#29494a]">
                        Projects
                    </h1>

                    <p className="mt-2 text-sm text-[#849595]">
                        Organize projects and keep your team's work moving forward.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openCreateProject}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#214f51] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#183f41]"
                >
                    <Plus size={18} />
                    New Project
                </button>
            </section>

            {/* STATISTICS */}

            <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <ProjectStatCard
                    icon={
                        <FolderKanban size={19} />
                    }
                    label="Total Projects"
                    value={statistics.total}
                />

                <ProjectStatCard
                    icon={
                        <FolderKanban size={19} />
                    }
                    label="Active"
                    value={statistics.active}
                />

                <ProjectStatCard
                    icon={
                        <CheckCircle2 size={19} />
                    }
                    label="Completed"
                    value={statistics.completed}
                />

                <ProjectStatCard
                    icon={
                        <CalendarDays size={19} />
                    }
                    label="On Hold"
                    value={statistics.onHold}
                />
            </section>

            {/* SEARCH + FILTER */}

            <section className="mb-8 rounded-2xl border border-[#e1e7e5] bg-[#f9faf9] p-4">
                <div className="flex flex-col gap-3 md:flex-row">

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
                            placeholder="Search projects..."
                            className="w-full rounded-xl border border-[#dce4e2] bg-white py-3 pl-10 pr-4 text-sm text-[#29494a] outline-none placeholder:text-[#a7b3b3] focus:border-[#527273]"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(
                                event.target
                                    .value as
                                | "all"
                                | ProjectStatus,
                            )
                        }
                        className="rounded-xl border border-[#dce4e2] bg-white px-4 py-3 text-sm text-[#527273] outline-none focus:border-[#527273]"
                    >
                        <option value="all">
                            All Projects
                        </option>

                        <option value="active">
                            Active
                        </option>

                        <option value="completed">
                            Completed
                        </option>

                        <option value="on-hold">
                            On Hold
                        </option>
                    </select>
                </div>
            </section>

            {/* PROJECT GRID */}

            {filteredProjects.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#d6dfdc] bg-[#fafbfa] px-5 py-16 text-center">
                    <FolderKanban
                        size={34}
                        className="mx-auto text-[#9daead]"
                    />

                    <h3 className="mt-4 text-base font-medium text-[#29494a]">
                        No projects found
                    </h3>

                    <p className="mt-2 text-sm text-[#849595]">
                        Try changing your search or create a new project.
                    </p>
                </div>
            ) : (
                <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {filteredProjects.map(
                        (project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                formatDate={formatDate}
                                isMenuOpen={
                                    menuProjectId ===
                                    project.id
                                }
                                onToggleMenu={() =>
                                    setMenuProjectId(
                                        menuProjectId ===
                                            project.id
                                            ? null
                                            : project.id,
                                    )
                                }
                                onOpen={() =>
                                    navigate(`/projects/${project.id}`)
                                }
                                onEdit={() =>
                                    openEditProject(
                                        project,
                                    )
                                }
                                onDelete={() =>
                                    deleteProject(
                                        project.id,
                                    )
                                }
                            />
                        ),
                    )}
                </section>
            )}

            {/* CREATE / EDIT MODAL */}

            {showProjectModal && (
                <ProjectModal
                    editingProject={
                        editingProject
                    }
                    projectName={projectName}
                    projectDescription={
                        projectDescription
                    }
                    projectStatus={
                        projectStatus
                    }
                    projectProgress={
                        projectProgress
                    }
                    projectDueDate={
                        projectDueDate
                    }
                    onClose={() =>
                        setShowProjectModal(false)
                    }
                    onSave={saveProject}
                    setProjectName={
                        setProjectName
                    }
                    setProjectDescription={
                        setProjectDescription
                    }
                    setProjectStatus={
                        setProjectStatus
                    }
                    setProjectProgress={
                        setProjectProgress
                    }
                    setProjectDueDate={
                        setProjectDueDate
                    }
                />
            )}
        </div>
    );
}

/* =====================================================
   PROJECT STAT CARD
===================================================== */

function ProjectStatCard({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
}) {
    return (
        <div className="rounded-2xl border border-[#e1e7e5] bg-[#f9faf9] p-5">
            <div className="flex items-center justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#e6f0ee] text-[#315b5d]">
                    {icon}
                </div>

                <p className="text-2xl font-semibold text-[#29494a]">
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
   PROJECT CARD
===================================================== */

function ProjectCard({
    project,
    formatDate,
    isMenuOpen,
    onToggleMenu,
    onOpen,
    onEdit,
    onDelete,
}: {
    project: Project;
    formatDate: (
        date: string,
    ) => string;
    isMenuOpen: boolean;
    onToggleMenu: () => void;
    onOpen: () => void;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const statusStyles = {
        active:
            "bg-[#dceee8] text-[#4c8774]",
        completed:
            "bg-[#e5eeee] text-[#527273]",
        "on-hold":
            "bg-[#f6edd1] text-[#a9842f]",
    };

    return (
        <article className="group relative rounded-2xl border border-[#e1e7e5] bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#cbd8d5] hover:shadow-lg">

            {/* HEADER */}

            <div className="flex items-start justify-between gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#e6f0ee] text-[#315b5d]">
                    <FolderKanban size={21} />
                </div>

                <div className="flex items-center gap-2">
                    <span
                        className={`rounded-lg px-2.5 py-1 text-[10px] font-medium capitalize ${statusStyles[
                            project.status
                        ]
                            }`}
                    >
                        {project.status ===
                            "on-hold"
                            ? "On Hold"
                            : project.status}
                    </span>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={onToggleMenu}
                            className="grid h-8 w-8 place-items-center rounded-lg text-[#849595] transition hover:bg-[#eef2f1]"
                        >
                            <MoreHorizontal
                                size={18}
                            />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 top-10 z-20 w-36 rounded-xl border border-[#e1e7e5] bg-white p-1.5 shadow-xl">
                                <button
                                    type="button"
                                    onClick={onEdit}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-[#527273] transition hover:bg-[#f2f5f4]"
                                >
                                    <Pencil size={14} />
                                    Edit Project
                                </button>

                                <button
                                    type="button"
                                    onClick={onDelete}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-[#c65b50] transition hover:bg-[#fde8e4]"
                                >
                                    <Trash2 size={14} />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CONTENT */}

            <h2 className="mt-5 text-lg font-semibold text-[#29494a]">
                {project.name}
            </h2>

            <p className="mt-2 min-h-[40px] text-sm leading-5 text-[#849595]">
                {project.description}
            </p>

            {/* PROGRESS */}

            <div className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-[#849595]">
                        Progress
                    </span>

                    <span className="text-xs font-semibold text-[#527273]">
                        {project.progress}%
                    </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-[#e8edeb]">
                    <div
                        className="h-full rounded-full bg-[#315b5d] transition-all duration-500"
                        style={{
                            width: `${project.progress}%`,
                        }}
                    />
                </div>
            </div>

            {/* PROJECT DETAILS */}

            <div className="mt-6 flex items-center justify-between border-t border-[#edf1f0] pt-4">

                <div className="flex items-center gap-2 text-xs text-[#849595]">
                    <CalendarDays size={15} />

                    {formatDate(
                        project.dueDate,
                    )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#849595]">
                    <CheckCircle2 size={15} />

                    {project.taskCount} tasks
                </div>
            </div>

            {/* FOOTER */}

            <div className="mt-5 flex items-center justify-between">

                {/* MEMBERS */}

                <div className="flex -space-x-2">
                    {project.members
                        .slice(0, 4)
                        .map((member, index) => (
                            <div
                                key={`${member}-${index}`}
                                className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-[#dfeae7] text-[10px] font-semibold text-[#527273]"
                            >
                                {member}
                            </div>
                        ))}

                    {project.members.length >
                        4 && (
                            <div className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-[#eef2f1] text-[9px] font-semibold text-[#527273]">
                                +
                                {project.members
                                    .length - 4}
                            </div>
                        )}
                </div>

                {/* OPEN */}

                <button
                    type="button"
                    onClick={onOpen}
                    className="flex items-center gap-1.5 text-sm font-medium text-[#315b5d] transition hover:text-[#183f41]"
                >
                    Open
                    <ArrowRight size={16} />
                </button>
            </div>
        </article>
    );
}

/* =====================================================
   PROJECT MODAL
===================================================== */

function ProjectModal({
    editingProject,
    projectName,
    projectDescription,
    projectStatus,
    projectProgress,
    projectDueDate,
    onClose,
    onSave,
    setProjectName,
    setProjectDescription,
    setProjectStatus,
    setProjectProgress,
    setProjectDueDate,
}: {
    editingProject: Project | null;
    projectName: string;
    projectDescription: string;
    projectStatus: ProjectStatus;
    projectProgress: number;
    projectDueDate: string;
    onClose: () => void;
    onSave: () => void;
    setProjectName: (
        value: string,
    ) => void;
    setProjectDescription: (
        value: string,
    ) => void;
    setProjectStatus: (
        value: ProjectStatus,
    ) => void;
    setProjectProgress: (
        value: number,
    ) => void;
    setProjectDueDate: (
        value: string,
    ) => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#163536]/30 p-4 backdrop-blur-sm">

            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-[#f9faf9] p-6 shadow-2xl">

                {/* HEADER */}

                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-[#29494a]">
                            {editingProject
                                ? "Edit Project"
                                : "Create Project"}
                        </h2>

                        <p className="mt-1 text-sm text-[#849595]">
                            {editingProject
                                ? "Update your project details."
                                : "Create a new workspace project."}
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

                {/* PROJECT NAME */}

                <div className="mt-6">
                    <label className="text-xs font-medium text-[#527273]">
                        Project Name
                    </label>

                    <input
                        autoFocus
                        value={projectName}
                        onChange={(event) =>
                            setProjectName(
                                event.target.value,
                            )
                        }
                        placeholder="Enter project name"
                        className="mt-2 w-full rounded-xl border border-[#dce4e2] bg-white px-4 py-3 text-sm text-[#29494a] outline-none placeholder:text-[#a7b3b3] focus:border-[#527273]"
                    />
                </div>

                {/* DESCRIPTION */}

                <div className="mt-5">
                    <label className="text-xs font-medium text-[#527273]">
                        Description
                    </label>

                    <textarea
                        rows={4}
                        value={projectDescription}
                        onChange={(event) =>
                            setProjectDescription(
                                event.target.value,
                            )
                        }
                        placeholder="Describe this project..."
                        className="mt-2 w-full resize-none rounded-xl border border-[#dce4e2] bg-white px-4 py-3 text-sm text-[#29494a] outline-none placeholder:text-[#a7b3b3] focus:border-[#527273]"
                    />
                </div>

                {/* STATUS */}

                <div className="mt-5">
                    <label className="text-xs font-medium text-[#527273]">
                        Project Status
                    </label>

                    <select
                        value={projectStatus}
                        onChange={(event) =>
                            setProjectStatus(
                                event.target
                                    .value as ProjectStatus,
                            )
                        }
                        className="mt-2 w-full rounded-xl border border-[#dce4e2] bg-white px-4 py-3 text-sm text-[#29494a] outline-none focus:border-[#527273]"
                    >
                        <option value="active">
                            Active
                        </option>

                        <option value="on-hold">
                            On Hold
                        </option>

                        <option value="completed">
                            Completed
                        </option>
                    </select>
                </div>

                {/* PROGRESS */}

                <div className="mt-5">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-[#527273]">
                            Progress
                        </label>

                        <span className="text-xs font-semibold text-[#315b5d]">
                            {projectProgress}%
                        </span>
                    </div>

                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={projectProgress}
                        onChange={(event) =>
                            setProjectProgress(
                                Number(
                                    event.target.value,
                                ),
                            )
                        }
                        className="mt-3 w-full accent-[#315b5d]"
                    />
                </div>

                {/* DUE DATE */}

                <div className="mt-5">
                    <label className="text-xs font-medium text-[#527273]">
                        Due Date
                    </label>

                    <input
                        type="date"
                        value={projectDueDate}
                        onChange={(event) =>
                            setProjectDueDate(
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
                        {editingProject
                            ? "Save Changes"
                            : "Create Project"}
                    </button>
                </div>
            </div>
        </div>
    );
}