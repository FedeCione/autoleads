import { PipelineStepDef } from '@/types/lead';

export const pipelineSteps: PipelineStepDef[] = [
  {
    label: 'Recepcion',
    description: 'Consulta ingresada al sistema',
    icon: '>>',
  },
  {
    label: 'Extraccion IA',
    description: 'Analizando datos con inteligencia artificial',
    icon: '{}',
  },
  {
    label: 'Clasificacion',
    description: 'Puntaje y prioridad asignada',
    icon: '#~',
  },
  {
    label: 'Respuesta',
    description: 'Borrador de respuesta generado',
    icon: '<>',
  },
];
