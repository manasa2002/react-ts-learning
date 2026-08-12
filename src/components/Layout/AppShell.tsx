import { Outlet, Link } from 'react-router-dom'

export default function AppShell() {
    return (
        <div className="flex h-screen">
            {/* sidebar */}
            <aside className="w-60 shrink-0 border-r border-gray-200 flex flex-col">
                <div className='px-4 py-4 font-semibold text-lg'>Issue Tracker</div>
                <nav className='flex-1 px-2 space-y-1'>
                    <Link to="/" className='block px-3 py-2 rounded-md text-sm hover:bg-gray-100'>
                        Dashboard</Link>
                    <Link to="/projects" className='block px-3 py-2 rounded-md text-sm hover:bg-gray-100'>
                        Projects</Link>
                    <Link to="/team" className='block px-3 py-2 rounded-md text-sm hover:bg-gray-100'>
                        Team</Link>
                </nav>
            </aside>

            {/* Main area */}
            <div className='flex-1 flex flex-col min-w-0'>
                {/* Topbar */}
                <header className='h-14 border-b border-gray-200 flex items-center justify-between px-4'>
                    <div className='text-sm text-gray-500'>Workspace</div>
                    <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 rounded-full bg-gray-300 ' />
                    </div>
                </header>

                {/* page content */}
                <main className='flex-1 overflow-auto p-6'>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
