import { QueryResult } from "pg";
import { DBConection, db } from "../config/database/db";

export interface Relacion {
    tipo_relacion: string;
    miembro_id_base: number;
    miembro_id_relacionado: number;
    nombre_miembro?: string;
}

export class RelacionModel {

    private dbConexion: DBConection;
    public tipo_relacion: string;
    public miembro_id_base: number;
    public miembro_id_relacionado: number;

    constructor(data: Relacion | undefined) {
        const { tipo_relacion, miembro_id_base, miembro_id_relacionado } = data || {};
        this.tipo_relacion = tipo_relacion || "";
        this.miembro_id_base = miembro_id_base || 0;
        this.miembro_id_relacionado = miembro_id_relacionado || 0;
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

    public async getOne(miembro_id_base: number, miembro_id_relacionado: number): Promise<Relacion | undefined> {
        try {
            const client = await this.dbConexion.connect();
            const result = await client.query('SELECT * FROM relacion WHERE miembro_id_base = $1 and miembro_id_relacionado = $2', [miembro_id_base, miembro_id_relacionado]);
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
            const result = await client.query('INSERT INTO relacion( tipo_relacion, miembro_id_base, miembro_id_relacionado) VALUES($1,$2,$3)', [this.tipo_relacion, this.miembro_id_base, this.miembro_id_relacionado]);
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
            const result = await client.query('UPDATE relacion SET tipo_relacion = $1 WHERE miembro_id_base=$2 and miembro_id_relacionado=$3', [this.tipo_relacion, this.miembro_id_base, this.miembro_id_relacionado]);
            return result;
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
        } finally {
            await this.dbConexion.disconnect();
        }
    }

    public async delete(miembro_id_base: number, miembro_id_relacionado: number) {
        try {
            const client = await this.dbConexion.connect();
            const result = await client.query('DELETE FROM relacion WHERE miembro_id_base = $1 and miembro_id_relacionado = $2', [miembro_id_base, miembro_id_relacionado]);
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
            const { tipo_relacion, miembro_id_base, miembro_id_relacionado, nombre_miembro } = item;
            return {
                tipo_relacion,
                miembro_id_base,
                miembro_id_relacionado,
                nombre_miembro
            }
        });
    }

    private async formatearDato(data: QueryResult): Promise<Relacion> {
        const { rows } = data;
        const { tipo_relacion, miembro_id_base, miembro_id_relacionado, nombre_miembro } = rows[0];
        return {
            tipo_relacion,
            miembro_id_base,
            miembro_id_relacionado,
            nombre_miembro
        }
    }
}