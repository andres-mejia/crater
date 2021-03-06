export const budgets = (state) => state.budgets
export const selectAllField = (state) => state.selectAllField
export const getTemplateId = (state) => state.estimateTemplateId
export const selectedEstimates = (state) => state.selectedEstimates
export const totalEstimates = (state) => state.totalEstimates
export const selectedCustomer = (state) => state.selectedCustomer
export const getEstimate = (state) => (id) => {
  let invId = parseInt(id)
  return state.budgets.find(budget => budget.id === invId)
}
