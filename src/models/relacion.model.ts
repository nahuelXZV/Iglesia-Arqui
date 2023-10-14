import { QueryResult } from "pg";
import { DBConection, db } from "../config/database/db";

export interface Relacion {
    id?: number;
    tipo_relacion: string;
    miembro_id_base: number;
    miembro_id_relacionado: number;
    nombre_miembro?: string;
}

export class RelacionModel {

    private dbConexion: DBConection;
    public id: number;
    public tipo_relacion: string;
    public miembro_id_base: number;
    public miembro_id_relacionado: number;

    constructor(data: Relacion | undefined) {
        const { tipo_relacion, miembro_id_base, miembro_id_relacionado, id } = data || {};
        this.tipo_relacion = tipo_relacion || "";
        this.miembro_id_base = miembro_id_base || 0;
        this.miembro_id_relacionado = miembro_id_relacionado || 0;
        this.id = id || 0;
        this.dbConexion = new db();
    }

    public async getAll(): Promise<Relacion[] | undefined> {
        try {
            const client = await this.dbConexion.connect();
            const result = await client.query('SELECT relacion.*, miembro.nombre as nombre_miembro FROM relacion, miembro WHERE relacion.miembro_id_relacionado=miembro.id');
            return await this.formatearDatos(result);
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
        } finally {
            await this.dbConexion.disconnect();
        }
    }

    public async getOne(id: number): Promise<Relacion | undefined> {
        try {
            const client = await this.dbConexion.connect();
            const result = await client.query('SELECT * FROM relacion WHERE id = $1', [id]);
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
            const id = await client.query('SELECT MAX(id) FROM relacion');
            this.id = id.rows[0].max + 1;
            const result = await client.query('INSERT INTO relacion(id, tipo_relacion, miembro_id_base,miembro_id_relacionado) VALUES($1,$2,$3,$4)', [this.id, this.tipo_relacion, this.miembro_id_base, this.miembro_id_relacionado]);
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
            const result = await client.query('UPDATE relacion SET tipo_relacion = $1, miembro_id_base=$2,miembro_id_relacionado=$3 WHERE id = $4', [this.tipo_relacion, this.miembro_id_base, this.miembro_id_relacionado, this.id]);
            return result;
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
        } finally {
            await this.dbConexion.disconnect();
        }
    }

    public async delete(id: number) {
        try {
            const client = await this.dbConexion.connect();
            const result = await client.query('DELETE FROM relacion WHERE id = $1', [id]);
            return result;
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
        } finally {
            await this.dbConexion.disconnect();
        }
    }

    public async deleteByMiembro(id: number) {
        try {
            const client = await this.dbConexion.connect();
            const result = await client.query('DELETE FROM relacion WHERE miembro_id_base = $1', [id]);
            return result;
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
        } finally {
            await this.dbConexion.disconnect();
        }
    }


    private async formatearDatos(data: QueryResult): Promise<Relacion[]> {
        const { rows } = data;
        return rows.map((item: any) => {
            const { id, tipo_relacion, miembro_id_base, miembro_id_relacionado, nombre_miembro } = item;
            return {
                id,
                tipo_relacion,
                miembro_id_base,
                miembro_id_relacionado,
                nombre_miembro
            }
        });
    }

    private async formatearDato(data: QueryResult): Promise<Relacion> {
        const { rows } = data;
        const { id, tipo_relacion, miembro_id_base, miembro_id_relacionado, nombre_miembro } = rows[0];
        return {
            id,
            tipo_relacion,
            miembro_id_base,
            miembro_id_relacionado,
            nombre_miembro
        }
    }
}