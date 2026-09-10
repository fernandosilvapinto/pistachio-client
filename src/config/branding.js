// Identidade visual e textos do operador da plataforma.
// A plataforma é agnóstica ao negócio: estes valores vêm da configuração,
// e os valores por omissão servem apenas de exemplo em desenvolvimento.

const env = import.meta.env;

export const branding = {
  name:            env.VITE_BRAND_NAME            ?? 'Pistachio Moto',
  icon:            env.VITE_BRAND_ICON            ?? '\u{1F527}',
  statusBadge:     env.VITE_BRAND_STATUS          ?? 'Oficina aberta \u2014 Seg a S\u00e1b, 9h\u201318h',
  headline:        env.VITE_BRAND_HEADLINE        ?? 'A tua moto em boas m\u00e3os.',
  intro:           env.VITE_BRAND_INTRO           ?? 'Manuten\u00e7\u00e3o, revis\u00f5es e repara\u00e7\u00f5es por profissionais especializados. Agenda online em poucos minutos.',
  servicesIntro:   env.VITE_BRAND_SERVICES_INTRO  ?? 'Servi\u00e7os especializados para a tua moto.',
  addressLine1:    env.VITE_BRAND_ADDRESS_1       ?? 'Rua das Motos, 123',
  addressLine2:    env.VITE_BRAND_ADDRESS_2       ?? 'Porto, Portugal',
  hoursWeekdays:   env.VITE_BRAND_HOURS_WEEKDAYS  ?? 'Segunda a Sexta: 9h\u201318h',
  hoursWeekend:    env.VITE_BRAND_HOURS_WEEKEND   ?? 'S\u00e1bado: 9h\u201313h',
  phone:           env.VITE_BRAND_PHONE           ?? '+351 220 000 000',
  email:           env.VITE_BRAND_EMAIL           ?? 'geral@pistachio.pt',
};

export default branding;
