import { QueryResult } from "pg";
import { DBConection, db } from "../config/database/db";

export interface Ministerio {
    id?: number;
    nombre: string;
}

export class MinisterioModel {

    private dbConexion: DBConection;
    public id: number;
    public nombre: string;

    constructor(data: Ministerio | undefined) {
        const { nombre = "", id } = data || {};
        this.nombre = nombre;
        this.id = id || 0;
        this.dbConexion = new db();
    }

    public async getAll(): Promise<Ministerio[] | undefined> {
        const client = await this.dbConexion.connect();
        try {
            const result = await client.query('SELECT * FROM ministerio');
            return await this.formatearDatos(result);
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
        } finally {
            await this.dbConexion.disconnect();
        }
    }

    public async getOne(id: number): Promise<Ministerio | undefined> {
        const client = await this.dbConexion.connect();
        try {
            const result = await client.query('SELECT * FROM ministerio WHERE id = $1', [id]);
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
            const id = await client.query('SELECT MAX(id) FROM ministerio');
            this.id = id.rows[0].max + 1;
            const result = await client.query('INSERT INTO ministerio(id, nombre) VALUES($1,$2)', [this.id, this.nombre]);
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
            const result = await client.query('UPDATE ministerio SET nombre = $1 WHERE id = $2', [this.nombre, this.id]);
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
            const result = await client.query('DELETE FROM ministerio WHERE id = $1', [id]);
            return result;
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
        } finally {
            await this.dbConexion.disconnect();
        }
    }

    private async formatearDatos(data: QueryResult): Promise<Ministerio[]> {
        const { rows } = data;
        return rows.map((item: any) => {
            const { nombre, id } = item;
            return {
                id,
                nombre
            }
        });
    }

    private async formatearDato(data: QueryResult): Promise<Ministerio> {
        const { rows } = data;
        const { nombre, id } = rows[0];
        return {
            id,
            nombre
        }
    }
}