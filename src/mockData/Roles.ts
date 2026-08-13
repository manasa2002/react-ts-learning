export type Role = 'admin' | 'member';

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
}

export interface TeamMember {
    userId: string;
    teamId: string;
    role: Role;
    joinedAt: string;
}

export interface Team {
    id: string;
    name: string;
    ownerId: string;
    createdAt: string;
}

export interface Project {
    id: string;
    teamId: string;
    name: string;
    description?: string;
    createdAt: string;
}

export interface Task {
    id: string;
    projectId: string;
    title: string;
    description?: string;
    status: TaskStatus;
    assigneeId?: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface Comment {
    id: string;
    taskId: string;
    authorId: string;
    content: string;
    createdAt: string;
}