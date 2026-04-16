import { z } from 'zod/v4';

export const leadRequestSchema = z.object({
  lead: z.object({
    nombre: z.string().min(1).max(100),
    fuente: z.enum([
      'WhatsApp',
      'Formulario web',
      'MercadoLibre',
      'Instagram',
    ]),
    mensaje: z.string().min(3).max(1000),
  }),
});

export const aiOutputSchema = z.object({
  operacion: z.string(),
  tipo_propiedad: z.string(),
  presupuesto: z.string(),
  zona: z.string(),
  ambientes: z.string(),
  intencion: z.string(),
  prioridad: z
    .string()
    .transform((v) => v.toLowerCase() as 'alta' | 'media' | 'baja'),
  score: z.coerce.number().min(0).max(100),
  razon_score: z.string(),
  respuesta_sugerida: z.string(),
});

export type AiOutput = z.infer<typeof aiOutputSchema>;
