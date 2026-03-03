import { create } from 'zustand'

export interface Project {
    id: string
    title: string
    description: string
    type: 'game' | 'tool' | 'other'
    thumbnail?: string
    placeholder?: boolean
}

interface ProjectState {
    projects: Project[]
    currentProject: Project | null
    getProjectById: (id: string) => Project | undefined
    setCurrentProject: (id: string) => void
}

export const useProjectStore = create<ProjectState>((set, get) => ({
    projects: [
        {
            id: 'catgame',
            title: '猫抓鱼小游戏',
            description: '经典的猫抓鱼游戏',
            type: 'game',
            placeholder: false
        },
        {
            id: 'snake',
            title: '贪吃蛇游戏',
            description: '经典贪吃蛇小游戏',
            type: 'game',
            placeholder: false
        },
        {
            id: 'invest',
            title: '投资模拟',
            description: '模拟投资项目的收益和风险',
            type: 'other',
            placeholder: false
        },
    ],
    currentProject: null,
    getProjectById: (id: string) => {
        return get().projects.find(p => p.id === id)
    },
    setCurrentProject: (id: string) => {
        const project = get().getProjectById(id)
        set({ currentProject: project || null })
    }
}))
