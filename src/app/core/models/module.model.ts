export interface Module {
    id: number;
    name: string;
    description: string;
    orderIndex: number;
    imageUrl?: string;
    quizCount: number;
    puzzleCount: number;
}

export interface ModuleCreateDTO {
    name: string;
    description: string;
    orderIndex: number;
    imageUrl?: string;
}

export interface ModuleUpdateDTO {
    name: string;
    description: string;
    orderIndex: number;
    imageUrl?: string;
}
