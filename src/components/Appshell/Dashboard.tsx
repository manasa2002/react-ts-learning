// src/pages/Dashboard.tsx
import { Link } from 'react-router-dom'
import { mockProjects } from '../../mockData/data'

export default function Dashboard() {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium">Projects</h2>
                <button className="rounded-md bg-indigo-500 hover:bg-indigo-400 transition-colors text-sm font-medium px-4 py-2">
                    New Project
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockProjects.map((project) => (
                    <Link
                        key={project.id}
                        to={`/projects/${project.id}`}
                        className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors p-4 text-left"
                    >
                        <h3 className="font-medium mb-1">{project.name}</h3>
                        {project.description && (
                            <p className="text-sm text-gray-400 line-clamp-2">
                                {project.description}
                            </p>
                        )}
                        <p className="text-xs text-gray-500 mt-3">
                            Created {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    )
}