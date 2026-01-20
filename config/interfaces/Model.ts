import { Variable } from "./Variable";

export interface Model {
    id: number;
    label: string;
    variable: Variable[];
}