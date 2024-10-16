export function badRequest(message: string): never {
    const error = new Error(message);
    (error as any).status = 400;
    throw error;
}
  