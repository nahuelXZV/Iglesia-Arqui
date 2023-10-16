import { QueryResult } from "pg";
import { DBConection, db } from "../config/database/db";
import { Participo, ParticipoModel } from "./participo.model";

export interface Evento {
    id?: number;
    descripcion: string;
    fecha: string;
    hora: string;
    nombre: string;
    participantes?: Participo[];
    arrayParticipantes?: number[];
}

export class EventoModel {

    private dbConexion: DBConection;
    private participoModel?: ParticipoModel;
    public id: number;
    public descripcion: string;
    public fecha: string;
    public hora: string;
    public nombre: string;
    public participantes: Participo[];
    public arrayParticipantes: number[];

    constructor(data: Evento | undefined) {
        this.id = data?.id || 0;
        this.descripcion = data?.descripcion || "";
        this.fecha = data?.fecha || "";
        this.hora = data?.hora || "";
        this.nombre = data?.nombre || "";
        this.participantes = data?.participantes || [];
        this.arrayParticipantes = data?.arrayParticipantes || [];
        this.dbConexion = new db();
    }

    public async getAll(): Promise<Evento[] | undefined> {
        const client = await this.dbConexion.connect();
        const participoModel = new ParticipoModel(undefined);
        try {
            const result = await client.query('SELECT evento.* FROM evento');
            const participacionesTotal = await participoModel.getAll() || [];
            const eventos = await this.formatearDatos(result);
            const eventosResult = eventos.map((item: Evento) => {
                const { id } = item;
                const participanteEvento = participacionesTotal.filter((item: Participo) => item.evento_id === id)
                const participantes: Participo[] = [];
                participanteEvento.forEach((item: Participo) => {
                    const { evento_id, miembro_nombre, miembro_id } = item;
                    participantes.push({
                        evento_id,
                        miembro_nombre,
                        miembro_id
                    });
                });
                return { ...item, participantes };
            });
            return eventosResult;
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
        } finally {
            await this.dbConexion.disconnect();
        }
    }

    public async getOne(id: number): Promise<Evento | undefined> {
        const client = await this.dbConexion.connect();
        try {
            const result = await client.query('SELECT * FROM evento WHERE id = $1', [id]);
            return await this.formatearDato(result);
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
        } finally {
            await this.dbConexion.disconnect();
        }
    }

    public async store() {
        const client = await this.dbConexion.connect();
        try {
            const id = await client.query('SELECT MAX(id) FROM evento');
            this.id = id.rows[0].max + 1;
            const result = await client.query('INSERT INTO  evento(id, descripcion, fecha, hora, nombre) VALUES($1,$2,$3,$4,$5)', [
                this.id,
                this.descripcion,
                this.fecha,
                this.hora,
                this.nombre
            ]);
            this.formatearParticipantes(this.arrayParticipantes || []).forEach(async (item: Participo) => {
                this.participoModel = new ParticipoModel(item);
                await this.participoModel.store();
            });
            return result;
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
        } finally {
            await this.dbConexion.disconnect();
        }
    }

    public async update() {
        const client = await this.dbConexion.connect();
        try {
            const result = await client.query(' UPDATE evento SET descripcion = $1, fecha=$2, hora=$3, nombre=$4 WHERE id = $5', [
                this.descripcion,
                this.fecha,
                this.hora,
                this.nombre,
                this.id
            ]);
            await new ParticipoModel(undefined).deleteByEvento(this.id);
            this.formatearParticipantes(this.arrayParticipantes || []).forEach(async (item: Participo) => {
                this.participoModel = new ParticipoModel(item);
                await this.participoModel.store();
            });
            return result;
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
        } finally {
            await this.dbConexion.disconnect();
        }
    }

    public async delete(id: number) {
        const client = await this.dbConexion.connect();
        try {
            await new ParticipoModel(undefined).deleteByEvento(id);
            const result = await client.query('DELETE FROM evento WHERE id = $1', [id]);
            return result;
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
        } finally {
            await this.dbConexion.disconnect();
        }
    }

    private formatearParticipantes(participantes: number[]): Participo[] {
        return participantes.map((item: number) => {
            return {
                evento_id: this.id,
                miembro_id: item
            }
        });
    }


    private async formatearDatos(data: QueryResult): Promise<Evento[]> {
        const { rows } = data;
        return rows.map((item: any) => {
            return {
                id: item.id,
                descripcion: item.descripcion,
                fecha: item.fecha,
                hora: item.hora,
                nombre: item.nombre,
            }
        });
    }

    private async formatearDato(data: QueryResult): Promise<Evento> {
        const { rows } = data;
        return {
            id: rows[0].id,
            descripcion: rows[0].descripcion,
            fecha: rows[0].fecha,
            hora: rows[0].hora,
            nombre: rows[0].nombre,
        }
    }
}