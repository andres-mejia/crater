const settings = {
  tableClass: '',
  theadClass: '',
  tbodyClass: '',
  headerClass: '',
  cellClass: '',
  filterInputClass: '',
  filterPlaceholder: 'Filtrar tabla…',
  filterNoResults: 'No se han encontrado registros coincidentes'
}

export function mergeSettings (newSettings) {
  for (const setting in newSettings) {
    settings[setting] = newSettings[setting]
  }
}

export default settings
