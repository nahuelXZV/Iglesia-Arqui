import { QueryResult } from "pg";
import { DBConection, db } from "../config/database/db";

export interface Cargo {
    id?: number;
    nombre: string;
    descripcion: string;
    ministerio_id: number;
    ministerio?: string;
}

export class CargoModel {

    private dbConexion: DBConection;
    public id: number;
    public nombre: string;
    public descripcion: string;
    public ministerio_id: number;

    constructor(data: Cargo | undefined) {
        const { nombre, id, descripcion, ministerio_id } = data || {};
        this.nombre = nombre || "";
        this.id = id || 0;
        this.descripcion = descripcion || "";
        this.ministerio_id = ministerio_id || 0;
        this.dbConexion = new db();
    }

    public async getAll(): Promise<Cargo[] | undefined> {
        const client = await this.dbConexion.connect();
        try {
            const result = await client.query('SELECT cargo.*, ministerio.nombre as ministerio FROM cargo, ministerio WHERE cargo.ministerio_id = ministerio.id'); 
            return await this.formatearDatos(result);
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
        } finally {
            await this.dbConexion.disconnect();
        }
    }

    public async getOne(id: number): Promise<Cargo | undefined> {
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
            const id = await client.query('SELECT MAX(id) FROM Cargo');
            this.id = id.rows[0].max + 1;
            const result = await client.query('INSERT INTO cargo(id, nombre, descripcion, ministerio_id) VALUES($1, $2, $3, $4)', [this.id, this.nombre, this.descripcion, this.ministerio_id]);
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
            const result = await client.query('UPDATE cargo SET nombre = $1, descripcion = $2, ministerio_id = $3 WHERE id = $4', [this.nombre, this.descripcion, this.ministerio_id, this.id]);
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

    private async formatearDatos(data: QueryResult): Promise<Cargo[]> {
        const { rows } = data;
        return rows.map((item: any) => {
            const { nombre, id, descripcion, ministerio_id, ministerio } = item;
            return {
                id,
                nombre,
                ministerio_id,
                descripcion,
                ministerio
            }
        });
    }

    private async formatearDato(data: QueryResult): Promise<Cargo> {
        const { rows } = data;
        const { nombre, id, descripcion, ministerio_id } = rows[0];
        return {
            id,
            nombre,
            ministerio_id,
            descripcion
        }
    }
}