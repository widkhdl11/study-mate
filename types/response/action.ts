
export interface ActionError {
  message: string;
  field?: string;
}

export type ActionResponse<T = void> =
  | { success: true; data?: T | T[] }
  | { success: false; error: ActionError };


