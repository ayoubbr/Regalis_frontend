export interface Module {
    id: number;
    name: string;
    description: string;
    orderIndex: number;
    imageUrl?: string;
    lessonCount: number;
    puzzleCount: number;
}

export interface ModuleCreateDTO {
    name: string;
    description: string;
    orderIndex: number;
}

export interface ModuleUpdateDTO {
    name: string;
    description: string;
    orderIndex: number;
}
