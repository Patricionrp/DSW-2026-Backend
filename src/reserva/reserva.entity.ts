import crypto from 'node:crypto';

export class Reserva {
  constructor(
    public usuarioId: string,
    public espacioId: string,
    public fecha: Date,
    public estado: 'pendiente' | 'confirmada' | 'cancelada' | 'rechazada' = 'pendiente',
    public id = crypto.randomUUID()
  ) {}
}