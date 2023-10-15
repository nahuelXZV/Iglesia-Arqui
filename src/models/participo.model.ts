import { QueryResult } from "pg";
import { DBConection, db } from "../config/database/db";

export interface Participo {
    miembro_id: number;
    evento_id: number;
    miembro_nombre?: string;
}

export class ParticipoModel {

    private dbConexion: DBConection;
    public miembro_id: number;
    public evento_id: number;

    constructor(data: Participo | undefined) {
        const { miembro_id, evento_id } = data || {};
        this.miembro_id = miembro_id || 0;
        this.evento_id = evento_id || 0;
        this.dbConexion = new db();
    }

    public async getAll(): Promise<Participo[] | undefined> {
        try {
            const client = await this.dbConexion.connect();
            const result = await client.query('SELECT participo.*, miembro.nombre as miembro_nombre FROM participo,miembro WHERE participo.miembro_id=miembro.id');
            return await this.formatearDatos(result);
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
        } finally {
            await this.dbConexion.disconnect();
        }
    }

    public async getOne(id: number): Promise<Participo | undefined> {
        try {
            const client = await this.dbConexion.connect();
            const result = await client.query('SELECT * FROM participo WHERE id = $1', [id]);
            return await this.formatearDato(result);
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
        } finally {
            await this.dbConexion.disconnect();
        }
    }

    public async store() {
        try {
            const client = await this.dbConexion.connect();
            const result = await client.query('INSERT INTO participo(miembro_id, evento_id) VALUES($1,$2)', [this.miembro_id, this.evento_id]);
            return result;
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
        } finally {
            await this.dbConexion.disconnect();
        }
    }

    public async update() {
        try {
            const client = await this.dbConexion.connect();
            const result = await client.query('UPDATE participo SET miembro_id = $1, evento_id=$2 WHERE id = $3', [this.miembro_id, this.evento_id]);
            return result;
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
        } finally {
            await this.dbConexion.disconnect();
        }
    }

    public async delete(miembro_id: number, evento_id: number) {
        try {
            const client = await this.dbConexion.connect();
            const result = await client.query('DELETE FROM participo WHERE miembro_id = $1 AND evento_id = $2', [miembro_id, evento_id]);
            return result;
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
        } finally {
            await this.dbConexion.disconnect();
        }
    }

    public async deleteByEvento(id: number) {
        try {
            const client = await this.dbConexion.connect();
            const result = await client.query('DELETE FROM participo WHERE evento_id = $1', [id]);
            return result;
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
        } finally {
            await this.dbConexion.disconnect();
        }
    }


    private async formatearDatos(data: QueryResult): Promise<Participo[]> {
        const { rows } = data;
        return rows.map((item: any) => {
            const { miembro_id, evento_id, miembro_nombre } = item;
            return {
                miembro_id,
                evento_id,
                miembro_nombre
            }
        });
    }

    private async formatearDato(data: QueryResult): Promise<Participo> {
        const { rows } = data;
        const { miembro_id, evento_id, miembro_nombre } = rows[0];
        return {
            miembro_id,
            evento_id,
            miembro_nombre
        }
    }
}