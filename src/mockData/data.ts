import type { Project } from "./Roles";


export const mockProjects: Project[] = [
    {
        id: '1',
        teamId: 'team-1',
        name: 'Website Redesign',
        description: 'Revamp marketing site and landing pages',
        createdAt: '2026-06-01T10:00:00Z',
    },
    {
        id: '2',
        teamId: 'team-1',
        name: 'Mobile App',
        description: 'iOS and Android app for internal tools',
        createdAt: '2026-06-15T10:00:00Z',
    },
    {
        id: '3',
        teamId: 'team-1',
        name: 'API Migration',
        description: 'Move legacy REST endpoints to new service',
        createdAt: '2026-07-01T10:00:00Z',
    },
]