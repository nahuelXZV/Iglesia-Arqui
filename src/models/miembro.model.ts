import { QueryResult } from "pg";
import { DBConection, db } from "../config/database/db";
import { Relacion, RelacionModel } from "./relacion.model";

export interface RelacionRequest {
    miembro: string;
    miembro_id_relacionado: number;
    tipo_relacion: string;
}

export interface Miembro {
    id?: number;
    nombre: string;
    telefono: string;
    correo: string;
    direccion: string;
    fecha_nacimiento: string;
    invitado_por?: number;
    relaciones?: RelacionRequest[];
    nombre_invitado_por?: string;
}

export class MiembroModel {

    private dbConexion: DBConection;
    private relacionModel?: RelacionModel;
    public id: number;
    public nombre: string;
    public telefono: string;
    public correo: string;
    public direccion: string;
    public fecha_nacimiento: string;
    public invitado_por?: number;
    public relaciones?: RelacionRequest[];

    constructor(data: Miembro | undefined) {
        this.id = data?.id || 0;
        this.nombre = data?.nombre || "";
        this.telefono = data?.telefono || "";
        this.correo = data?.correo || "";
        this.direccion = data?.direccion || "";
        this.fecha_nacimiento = data?.fecha_nacimiento || "";
        this.invitado_por = data?.invitado_por;
        this.relaciones = data?.relaciones;
        this.dbConexion = new db();
    }

    public async getAll(): Promise<Miembro[] | undefined> {
        const client = await this.dbConexion.connect();
        const relacionModel = new RelacionModel(undefined);
        try {
            const result = await client.query('SELECT miembro.* FROM miembro ');
            const relacionesTotal = await relacionModel.getAll() || [];
            const miembros = await this.formatearDatos(result);
            const miembrosResult = miembros.map((item: Miembro) => {
                const { id } = item;
                const relacionesMiembro = relacionesTotal.filter((item: Relacion) => item.miembro_id_base === id)
                const relaciones: RelacionRequest[] = [];
                relacionesMiembro.forEach((item: Relacion) => {
                    const { tipo_relacion, miembro_id_relacionado, nombre_miembro } = item;
                    relaciones.push({
                        tipo_relacion,
                        miembro_id_relacionado,
                        miembro: nombre_miembro || ""
                    });
                });
                return { ...item, relaciones };
            });
            return miembrosResult;
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
            const result = await client.query('INSERT INTO miembro(id, nombre, telefono, correo, direccion, fecha_nacimiento, invitado_por) VALUES($1, $2, $3, $4, $5, $6, $7)', [
                this.id,
                this.nombre,
                this.telefono,
                this.correo,
                this.direccion,
                this.fecha_nacimiento,
                this.invitado_por
            ]);
            this.formatearRelaciones(this.relaciones || []).forEach(async (item: Relacion) => {
                this.relacionModel = new RelacionModel(item);
                await this.relacionModel.store();
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
            const result = await client.query(' UPDATE miembro SET nombre = $1, telefono = $2, correo = $3, direccion = $4, fecha_nacimiento = $5, invitado_por = $6 WHERE id = $7', [
                this.nombre,
                this.telefono,
                this.correo,
                this.direccion,
                this.fecha_nacimiento,
                this.invitado_por,
                this.id
            ]);
            await new RelacionModel(undefined).deleteByMiembro(this.id);
            this.formatearRelaciones(this.relaciones || []).forEach(async (item: Relacion) => {
                this.relacionModel = new RelacionModel(item);
                await this.relacionModel.store();
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
            await new RelacionModel(undefined).deleteByMiembro(id);
            const result = await client.query('DELETE FROM miembro WHERE id = $1', [id]);
            return result;
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
        } finally {
            await this.dbConexion.disconnect();
        }
    }

    private formatearRelaciones(relaciones: RelacionRequest[]): Relacion[] {
        return relaciones.map((item: RelacionRequest) => {
            const { miembro_id_relacionado, tipo_relacion } = item;
            return {
                id: 0,
                tipo_relacion,
                miembro_id_base: this.id,
                miembro_id_relacionado
            }
        });
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
                invitado_por: item.invitado_por
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
            invitado_por: rows[0].invitado_por,
            fecha_nacimiento: rows[0].fecha_nacimiento.toISOString().split('T')[0],
        }
    }
}