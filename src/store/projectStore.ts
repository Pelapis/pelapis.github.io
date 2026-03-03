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
            placeholder: true
        },
        {
            id: 'snake',
            title: '贪吃蛇游戏',
            description: '经典贪吃蛇小游戏',
            type: 'game',
            placeholder: true
        },
        {
            id: 'tetris',
            title: '俄罗斯方块',
            description: '经典俄罗斯方块游戏',
            type: 'game',
            placeholder: true
        },
        {
            id: 'memory',
            title: '记忆翻牌',
            description: '锻炼记忆力的翻牌游戏',
            type: 'game',
            placeholder: true
        },
        {
            id: 'calculator',
            title: '计算器',
            description: '功能完善的计算器工具',
            type: 'tool',
            placeholder: true
        },
        {
            id: 'weather',
            title: '天气查询',
            description: '实时天气信息查询',
            type: 'tool',
            placeholder: true
        }
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
