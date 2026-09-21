import crypto from 'node:crypto'

export class Espacio {
  constructor(
    public nombre: string,
    public descripcion: string,
    public capacidad: number,
    public tipo: string,
    public id = crypto.randomUUID()
  ) {}
}
