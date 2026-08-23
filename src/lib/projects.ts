export interface Project {
    id: string
    title: string
    description: string
    type: 'game' | 'tool' | 'other'
}

export const projects: Project[] = [
    {
        id: 'catgame',
        title: '猫抓鱼小游戏',
        description: '经典的猫抓鱼游戏',
        type: 'game',
    },
    {
        id: 'snake',
        title: '贪吃蛇游戏',
        description: '经典贪吃蛇小游戏',
        type: 'game',
    },
    {
        id: 'invest',
        title: '投资模拟',
        description: '模拟投资项目的收益和风险',
        type: 'other',
    },
]
