import * as types from './mutation-types'

export default {
  [types.SET_BUDGETS] (state, data) {
    state.budgets = data
  },

  [types.SET_TOTAL_BUDGETS] (state, totalEstimates) {
    state.totalEstimates = totalEstimates
  },

  [types.ADD_BUDGET] (state, data) {
    state.budgets = [...state.budgets, data]
  },

  [types.DELETE_BUDGET] (state, id) {
    let index = state.budgets.findIndex(budget => budget.id === id)
    state.budgets.splice(index, 1)
  },

  [types.SET_SELECTED_BUDGETS] (state, data) {
    state.selectedEstimates = data
  },

  [types.DELETE_MULTIPLE_BUDGETS] (state, selectedEstimates) {
    selectedEstimates.forEach((budget) => {
      let index = state.budgets.findIndex(_est => _est.id === budget.id)
      state.budgets.splice(index, 1)
    })

    state.selectedEstimates = []
  },

  [types.UPDATE_BUDGET] (state, data) {
    let pos = state.budgets.findIndex(budget => budget.id === data.budget.id)

    state.budgets[pos] = data.budget
  },

  [types.UPDATE_BUDGET_STATUS] (state, data) {
    let pos = state.budgets.findIndex(budget => budget.id === data.id)

    if (state.budgets[pos]) {
      state.budgets[pos].status = data.status
    }
  },

  [types.RESET_SELECTED_BUDGETS] (state, data) {
    state.selectedEstimates = []
    state.selectAllField = false
  },

  [types.SET_TEMPLATE_ID] (state, templateId) {
    state.budgetTemplateId = templateId
  },

  [types.SELECT_CUSTOMER] (state, data) {
    state.selectedCustomer = data
  },

  [types.RESET_SELECTED_CUSTOMER] (state, data) {
    state.selectedCustomer = null
  },

  [types.SET_SELECT_ALL_STATE] (state, data) {
    state.selectAllField = data
  }
}
