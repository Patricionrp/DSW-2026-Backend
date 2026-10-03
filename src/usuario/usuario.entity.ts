import crypto from 'node:crypto'

export class Usuario {
  constructor(
    public nombre: string,
    public apellido: string,
    public email: string,
    public id = crypto.randomUUID()
  ) {}
}