import { QueryResult } from "pg";
import { DBConection, db } from "../config/database/db";

export interface HistorialCargo {
    id?: number;
    estado: string;
    fecha_inicio: string;
    fecha_final: string;
    miembro_id: number;
    cargo_id: number;
    miembro_nombre?: string;
    cargo_nombre?: string;
}

export class HistorialCargoModel {

    private dbConexion: DBConection;
    public id: number;
    public estado: string;
    public fecha_inicio: string;
    public fecha_final: string;
    public miembro_id: number;
    public cargo_id: number;
    public miembro_nombre?: string;
    public cargo_nombre?: string;

    constructor(data: HistorialCargo | undefined) {
        this.id = data?.id || 0;
        this.estado = data?.estado || "";
        this.fecha_inicio = data?.fecha_inicio || "";
        this.fecha_final = data?.fecha_final || "";
        this.miembro_id = data?.miembro_id || 0;
        this.cargo_id = data?.cargo_id || 0;
        this.miembro_nombre = data?.miembro_nombre;
        this.cargo_nombre = data?.cargo_nombre;
        this.dbConexion = new db();
    }

    public async getAll(): Promise<HistorialCargo[] | undefined> {
        const client = await this.dbConexion.connect();
        try {
            const result = await client.query('SELECT historial_cargo.*, miembro.nombre as miembro_nombre, cargo.nombre as cargo_nombre FROM cargo, miembro, historial_cargo WHERE historial_cargo.miembro_id = miembro.id and historial_cargo.cargo_id = cargo.id');
            return await this.formatearDatos(result);
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
        } finally {
            await this.dbConexion.disconnect();
        }
    }

    public async getOne(id: number): Promise<HistorialCargo | undefined> {
        const client = await this.dbConexion.connect();
        try {
            const result = await client.query('SELECT * FROM cargo, ministerio WHERE cargo.ministerio_id = ministerio.id and id = $1', [id]);
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
            const id = await client.query('SELECT MAX(id) FROM historial_cargo');
            this.id = id.rows[0].max + 1;
            const result = await client.query('INSERT INTO historial_cargo (id, estado, fecha_inicio, fecha_final, miembro_id, cargo_id) VALUES ($1, $2, $3, $4, $5, $6)',
                [this.id, this.estado, this.fecha_inicio, this.fecha_final, this.miembro_id, this.cargo_id]);
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
            const result = await client.query('UPDATE historial_cargo SET estado = $1, fecha_inicio = $2, fecha_final = $3, miembro_id = $4, cargo_id = $5 WHERE id = $6', [this.estado, this.fecha_inicio, this.fecha_final, this.miembro_id, this.cargo_id, this.id]);
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
            const result = await client.query('DELETE FROM cargo WHERE id = $1', [id]);
            return result;
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
        } finally {
            await this.dbConexion.disconnect();
        }
    }

    private async formatearDatos(data: QueryResult): Promise<HistorialCargo[]> {
        const { rows } = data;
        return rows.map((item: any) => {
            return {
                id: item.id,
                estado: item.estado,
                fecha_inicio: item.fecha_inicio.toISOString().split('T')[0],
                fecha_final: item.fecha_final.toISOString().split('T')[0],
                miembro_id: item.miembro_id,
                cargo_id: item.cargo_id,
                miembro_nombre: item.miembro_nombre,
                cargo_nombre: item.cargo_nombre
            }
        });
    }

    private async formatearDato(data: QueryResult): Promise<HistorialCargo> {
        const { rows } = data;
        return {
            id: rows[0].id,
            estado: rows[0].estado,
            fecha_inicio: rows[0].fecha_inicio.toISOString().split('T')[0],
            fecha_final: rows[0].fecha_final.toISOString().split('T')[0],
            miembro_id: rows[0].miembro_id,
            cargo_id: rows[0].cargo_id,
            miembro_nombre: rows[0].miembro_nombre,
            cargo_nombre: rows[0].cargo_nombre
        }
    }
}