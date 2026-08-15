import {
  BarChart3,
  CalendarDays,
  CheckSquare,
  FolderKanban,
  Home,
  Settings,
  Users,
} from "lucide-react";

const tasks = {
  todo: [
    "Create wireframes",
    "Research competitors",
    "Setup repository",
  ],

  progress: [
    "Design landing page",
    "Implement hero section",
    "Responsive header",
  ],

  done: [
    "Project brief",
    "Color palette",
    "Typography",
  ],
};

export function ProductPreview() {
  return (
    <div className="relative z-10 overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-2xl backdrop-blur">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#0d5558] text-sm font-bold text-white">
            T
          </div>

          <div>
            <div className="text-sm font-bold text-[#123b3d]">
              Website Redesign
            </div>

            <div className="text-xs text-slate-400">
              Project workspace
            </div>
          </div>
        </div>

        <div className="flex -space-x-2">
          {["M", "A", "R"].map((letter) => (
            <div
              key={letter}
              className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-[#d9efea] text-xs font-bold text-[#0d5558]"
            >
              {letter}
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex min-h-[430px]">
        {/* Sidebar */}
        <aside className="hidden w-16 shrink-0 flex-col items-center gap-5 bg-[#123b3d] py-5 text-white sm:flex">
          <Home size={18} />

          <FolderKanban size={18} />

          <CheckSquare size={18} />

          <CalendarDays size={18} />

          <BarChart3 size={18} />

          <Users size={18} />

          <Settings
            size={18}
            className="mt-auto"
          />
        </aside>

        {/* Board */}
        <div className="min-w-0 flex-1 bg-[#f8faf9] p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-500">
              Project Board
            </div>

            <button className="rounded-lg bg-[#0d5558] px-3 py-2 text-xs font-semibold text-white">
              + Add task
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <BoardColumn
              title="To Do"
              color="bg-[#ffe5de]"
              tasks={tasks.todo}
            />

            <BoardColumn
              title="In Progress"
              color="bg-[#fff0cf]"
              tasks={tasks.progress}
            />

            <BoardColumn
              title="Done"
              color="bg-[#dcf3ec]"
              tasks={tasks.done}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function BoardColumn({
  title,
  color,
  tasks,
}: {
  title: string;
  color: string;
  tasks: string[];
}) {
  return (
    <div className="min-w-0">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-bold text-[#123b3d]">
          {title}
        </span>

        <span className="text-[10px] text-slate-400">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task}
            className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-[11px] font-semibold leading-4 text-[#123b3d]">
              {task}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span
                className={`h-1.5 w-10 rounded-full ${color}`}
              />

              <div className="grid h-5 w-5 place-items-center rounded-full bg-[#d9efea] text-[8px] font-bold text-[#0d5558]">
                M
              </div>
            </div>
          </div>
        ))}

        <button className="w-full rounded-xl border border-dashed border-slate-200 py-3 text-[10px] font-medium text-slate-400 transition hover:border-[#79c9b6] hover:text-[#0d7779]">
          + Add task
        </button>
      </div>
    </div>
  );
}