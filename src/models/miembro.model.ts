import { QueryResult } from "pg";
import { DBConection, db } from "../config/database/db";

export interface Miembro {
    id?: number;
    nombre: string;
    telefono: string;
    correo: string;
    direccion: string;
    fecha_nacimiento: string;
    miembro_id_invitador?: number;
    relaciones?: number[];
}

export class MiembroModel {

    private dbConexion: DBConection;
    public id: number;
    public nombre: string;
    public telefono: string;
    public correo: string;
    public direccion: string;
    public fecha_nacimiento: string;
    public miembro_id_invitador?: number;
    public relaciones?: number[];

    constructor(data: Miembro | undefined) {
        this.id = data?.id || 0;
        this.nombre = data?.nombre || "";
        this.telefono = data?.telefono || "";
        this.correo = data?.correo || "";
        this.direccion = data?.direccion || "";
        this.fecha_nacimiento = data?.fecha_nacimiento || "";
        this.miembro_id_invitador = data?.miembro_id_invitador;
        this.relaciones = data?.relaciones;
        this.dbConexion = new db();
    }

    public async getAll(): Promise<Miembro[] | undefined> {
        const client = await this.dbConexion.connect();
        try {
            const result = await client.query('SELECT miembro.* FROM miembro');
            return await this.formatearDatos(result);
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
        } finally {
            await this.dbConexion.disconnect();
        }
    }

    public async getOne(id: number): Promise<Miembro | undefined> {
        const client = await this.dbConexion.connect();
        try {
            const result = await client.query('SELECT * FROM miembro WHERE id = $1', [id]);
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
            const id = await client.query('SELECT MAX(id) FROM miembro');
            this.id = id.rows[0].max + 1;
            const result = await client.query('INSERT INTO miembro(id, nombre, telefono, correo, direccion, fecha_nacimiento) VALUES($1, $2, $3, $4, $5, $6)', [
                this.id,
                this.nombre,
                this.telefono,
                this.correo,
                this.direccion,
                this.fecha_nacimiento
            ]);
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
            const result = await client.query(' UPDATE miembro SET nombre = $1, telefono = $2, correo = $3, direccion = $4, fecha_nacimiento = $5 WHERE id = $6', [
                this.nombre,
                this.telefono,
                this.correo,
                this.direccion,
                this.fecha_nacimiento,
                this.id
            ]);
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
            const result = await client.query('DELETE FROM mimebro WHERE id = $1', [id]);
            return result;
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
        } finally {
            await this.dbConexion.disconnect();
        }
    }

    private async formatearDatos(data: QueryResult): Promise<Miembro[]> {
        const { rows } = data;
        return rows.map((item: any) => {
            return {
                id: item.id,
                nombre: item.nombre,
                telefono: item.telefono,
                correo: item.correo,
                direccion: item.direccion,
                fecha_nacimiento: item.fecha_nacimiento.toISOString().split('T')[0],
                miembro_id_invitador: item.miembro_id_invitador,
                relaciones: item.relaciones
            }
        });
    }

    private async formatearDato(data: QueryResult): Promise<Miembro> {
        const { rows } = data;
        return {
            id: rows[0].id,
            nombre: rows[0].nombre,
            telefono: rows[0].telefono,
            correo: rows[0].correo,
            direccion: rows[0].direccion,
            fecha_nacimiento: rows[0].fecha_nacimiento.toISOString().split('T')[0],
            miembro_id_invitador: rows[0].miembro_id_invitador,
            relaciones: rows[0].relaciones
        }
    }
}