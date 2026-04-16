export type LeadSource =
  | 'WhatsApp'
  | 'Formulario web'
  | 'MercadoLibre'
  | 'Instagram';

export interface Lead {
  id: string;
  nombre: string;
  fuente: LeadSource;
  mensaje: string;
}

export interface ProcessedLead extends Lead {
  operacion: string;
  tipo_propiedad: string;
  presupuesto: string;
  zona: string;
  ambientes: string;
  intencion: string;
  prioridad: 'alta' | 'media' | 'baja';
  score: number;
  razon_score: string;
  respuesta_sugerida: string;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
  type: 'info' | 'success' | 'error' | 'processing';
}

export type PipelineStatus = 'pending' | 'active' | 'completed' | 'error';

export interface PipelineStepDef {
  label: string;
  description: string;
  icon: string;
}

export interface ProcessingState {
  active: boolean;
  currentIndex: number;
  currentStep: number;
  total: number;
}
