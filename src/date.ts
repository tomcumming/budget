export const dayMs = 1000 * 60 * 60 * 24;

export function startOfDay(date: Date): Date {
    return new Date(Math.floor(new Date().getTime() / dayMs) * dayMs)
}
