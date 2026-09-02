import {
    ArrowUpRight,
    CheckCircle2,
    Clock3,
    FolderKanban,
    MoreHorizontal,
    Plus,
    Users,
} from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    icon: React.ReactNode;
}

const upcomingTasks = [
    {
        title: "Finish landing page",
        project: "Website Redesign",
        date: "Today",
    },
    {
        title: "Review wireframes",
        project: "Mobile Application",
        date: "Tomorrow",
    },
    {
        title: "Prepare presentation",
        project: "Marketing Campaign",
        date: "Aug 24",
    },
];

const activities = [
    {
        user: "Manasa",
        action: "completed",
        task: "Project brief",
    },
    {
        user: "Alex",
        action: "moved",
        task: "Design landing page",
    },
    {
        user: "Riya",
        action: "created",
        task: "Responsive header",
    },
];

function Dashboard() {
    return (
        <div className="mx-auto max-w-[1400px]">
            {/* PAGE HEADER */}

            <section className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                    <p className="text-xs font-medium text-[#789090]">
                        Tuesday, August 20
                    </p>

                    <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#29494a]">
                        Good morning, Manasa 👋
                    </h1>

                    <p className="mt-2 text-sm text-[#849595]">
                        Here's what's happening in your workspace.
                    </p>
                </div>

                <button className="flex items-center justify-center gap-2 rounded-lg bg-[#214f51] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#183f41]">
                    <Plus size={16} />
                    New project
                </button>
            </section>

            {/* STATS */}

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Active Projects"
                    value="06"
                    change="+2 this month"
                    icon={<FolderKanban size={19} />}
                />

                <StatCard
                    title="Tasks In Progress"
                    value="24"
                    change="8 due this week"
                    icon={<Clock3 size={19} />}
                />

                <StatCard
                    title="Completed"
                    value="128"
                    change="+18% this month"
                    icon={<CheckCircle2 size={19} />}
                />

                <StatCard
                    title="Team Members"
                    value="08"
                    change="2 active today"
                    icon={<Users size={19} />}
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

                        <button className="text-[#8a9b9b] hover:text-[#29494a]">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>

                    <div className="mt-6 space-y-5">
                        <ProjectProgress
                            name="Website Redesign"
                            progress={72}
                            tasks="9 / 12 tasks completed"
                        />

                        <ProjectProgress
                            name="Mobile Application"
                            progress={54}
                            tasks="13 / 24 tasks completed"
                        />

                        <ProjectProgress
                            name="Marketing Campaign"
                            progress={38}
                            tasks="6 / 16 tasks completed"
                        />
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

                        <button className="text-xs font-medium text-[#315b5d]">
                            View all
                        </button>
                    </div>

                    <div className="mt-5 space-y-3">
                        {upcomingTasks.map((task) => (
                            <div
                                key={task.title}
                                className="flex items-center justify-between rounded-xl border border-[#e5eae9] bg-white p-3"
                            >
                                <div>
                                    <p className="text-xs font-medium text-[#29494a]">
                                        {task.title}
                                    </p>

                                    <p className="mt-1 text-[10px] text-[#8a9b9b]">
                                        {task.project}
                                    </p>
                                </div>

                                <span className="rounded-md bg-[#edf3f1] px-2 py-1 text-[10px] font-medium text-[#527273]">
                                    {task.date}
                                </span>
                            </div>
                        ))}
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
                        {activities.map((activity) => (
                            <div
                                key={activity.task}
                                className="flex items-center gap-3"
                            >
                                <div className="grid h-8 w-8 place-items-center rounded-full bg-[#dcebea] text-[10px] font-semibold text-[#527273]">
                                    {activity.user.charAt(0)}
                                </div>

                                <p className="text-xs text-[#718282]">
                                    <span className="font-semibold text-[#29494a]">
                                        {activity.user}
                                    </span>{" "}
                                    {activity.action}{" "}
                                    <span className="font-medium text-[#315b5d]">
                                        {activity.task}
                                    </span>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* WORKSPACE HEALTH */}

                <div className="rounded-2xl bg-[#214f51] p-5 text-white">
                    <p className="text-xs text-[#b8d3d0]">
                        WORKSPACE PROGRESS
                    </p>

                    <h2 className="mt-3 text-xl font-semibold">
                        You're making great progress.
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#b9d1cf]">
                        Your team completed 18% more tasks
                        compared to last month.
                    </p>

                    <button className="mt-5 flex items-center gap-2 text-sm font-medium text-white">
                        View analytics

                        <ArrowUpRight size={16} />
                    </button>
                </div>
            </section>
        </div>
    );
}

function StatCard({
    title,
    value,
    change,
    icon,
}: StatCardProps) {
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
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-[#29494a]">
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
                    className="h-full rounded-full bg-[#315b5d] transition-all"
                    style={{
                        width: `${progress}%`,
                    }}
                />
            </div>
        </div>
    );
}

export default Dashboard;