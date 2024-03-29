export interface Todo {
    id: string;
    title: string;
    description: string;
    status: string;
    date?: Date | number;
}