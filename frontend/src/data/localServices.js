export const SERVICE_COLORS = {
  teal: {
    dot: '#137A63',
    bg: '#E8F5F1',
  },
  blue: {
    dot: '#2563EB',
    bg: '#EFF6FF',
  },
  amber: {
    dot: '#D97706',
    bg: '#FFFBEB',
  },
}

export const LOCAL_SERVICES = [
  {
    id: 'packers-movers',
    titleKey: 'servicePackersMovers',
    subtitleKey: 'servicePackersMoversSub',
    color: 'teal',
    icon: 'local_shipping',
  },
  {
    id: 'home-cleaning',
    titleKey: 'serviceHomeCleaning',
    subtitleKey: 'serviceHomeCleaningSub',
    color: 'blue',
    icon: 'cleaning_services',
  },
  {
    id: 'electrician',
    titleKey: 'serviceElectrician',
    subtitleKey: 'serviceElectricianSub',
    color: 'amber',
    icon: 'electrical_services',
  },
  {
    id: 'plumber',
    titleKey: 'servicePlumber',
    subtitleKey: 'servicePlumberSub',
    color: 'teal',
    icon: 'plumbing',
  },
  {
    id: 'painting',
    titleKey: 'servicePainting',
    subtitleKey: 'servicePaintingSub',
    color: 'blue',
    icon: 'format_paint',
  },
  {
    id: 'legal-docs',
    titleKey: 'serviceLegalDocs',
    subtitleKey: 'serviceLegalDocsSub',
    color: 'amber',
    icon: 'gavel',
  },
]

export function getServiceIcon(serviceId, icon) {
  if (icon) return icon
  return LOCAL_SERVICES.find((s) => s.id === serviceId)?.icon ?? 'handyman'
}
