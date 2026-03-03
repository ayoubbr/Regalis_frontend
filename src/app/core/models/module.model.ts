export interface Module {
    id: number;
    name: string;
    description: string;
    orderIndex: number;
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
