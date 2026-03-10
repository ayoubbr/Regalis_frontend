export interface Category {
    id: number;
    name: string;
    description: string;
}

export interface CategoryCreateDTO {
    name: string;
    description: string;
}

export interface CategoryUpdateDTO {
    name?: string;
    description?: string;
}
