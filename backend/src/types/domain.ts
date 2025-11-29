export const Roles = ['AFILIADO', 'EMPLEADO', 'ADMIN'] as const;
export type Role = (typeof Roles)[number];

export const AppointmentStatuses = ['DISPONIBLE', 'RESERVADO', 'CANCELADO', 'COMPLETADO'] as const;
export type AppointmentStatus = (typeof AppointmentStatuses)[number];

export const StockCategories = ['FARMACIA', 'CIRUGIA', 'ODONTOLOGIA', 'TRAUMATOLOGIA', 'OTROS'] as const;
export type StockCategory = (typeof StockCategories)[number];
