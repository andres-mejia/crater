import * as types from './mutation-types'
import * as dashboardTypes from '../dashboard/mutation-types'

export const fetchEstimates = ({ commit, dispatch, state }, params) => {
  return new Promise((resolve, reject) => {
    window.axios.get(`/api/budgets`, {params}).then((response) => {
      commit(types.SET_BUDGETS, response.data.budgets.data)
      commit(types.SET_TOTAL_BUDGETS, response.data.budgetTotalCount)
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const getRecord = ({ commit, dispatch, state }, record) => {
  return new Promise((resolve, reject) => {
    window.axios.get(`/api/budgets/records?record=${record}`).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const fetchCreateEstimate = ({ commit, dispatch, state }) => {
  return new Promise((resolve, reject) => {
    window.axios.get(`/api/budgets/create`).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const fetchEstimate = ({ commit, dispatch, state }, id) => {
  return new Promise((resolve, reject) => {
    window.axios.get(`/api/budgets/${id}/edit`).then((response) => {
      commit(types.SET_TEMPLATE_ID, response.data.budget.budget_template_id)
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const fetchViewEstimate = ({ commit, dispatch, state }, id) => {
  return new Promise((resolve, reject) => {
    window.axios.get(`/api/budgets/${id}`).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const sendEmail = ({ commit, dispatch, state }, data) => {
  return new Promise((resolve, reject) => {
    window.axios.post(`/api/budgets/send`, data).then((response) => {
      if (response.data.success) {
        commit(types.UPDATE_BUDGET_STATUS, {id: data.id, status: 'SENT'})
        commit('dashboard/' + dashboardTypes.UPDATE_BUDGET_STATUS, { id: data.id, status: 'SENT' }, { root: true })
      }
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const addEstimate = ({ commit, dispatch, state }, data) => {
  return new Promise((resolve, reject) => {
    window.axios.post('/api/budgets', data).then((response) => {
      commit(types.ADD_BUDGET, response.data.budget)

      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const deleteEstimate = ({ commit, dispatch, state }, id) => {
  return new Promise((resolve, reject) => {
    window.axios.delete(`/api/budgets/${id}`).then((response) => {
      commit(types.DELETE_BUDGET, id)
      commit('dashboard/' + dashboardTypes.DELETE_BUDGET, id, { root: true })
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const deleteMultipleEstimates = ({ commit, dispatch, state }, id) => {
  return new Promise((resolve, reject) => {
    window.axios.post(`/api/budgets/delete`, {'id': state.selectedEstimates}).then((response) => {
      commit(types.DELETE_MULTIPLE_BUDGETS, state.selectedEstimates)
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const updateEstimate = ({ commit, dispatch, state }, data) => {
  return new Promise((resolve, reject) => {
    window.axios.put(`/api/budgets/${data.id}`, data).then((response) => {
      commit(types.UPDATE_BUDGET, response.data)
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const markAsAccepted = ({ commit, dispatch, state }, data) => {
  return new Promise((resolve, reject) => {
    window.axios.post(`/api/budgets/accept`, data).then((response) => {
      commit('dashboard/' + dashboardTypes.UPDATE_BUDGET_STATUS, { id: data.id, status: 'ACCEPTED' }, { root: true })
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const markAsRejected = ({ commit, dispatch, state }, data) => {
  return new Promise((resolve, reject) => {
    window.axios.post(`/api/budgets/reject`, data).then((response) => {
      commit('dashboard/' + dashboardTypes.UPDATE_BUDGET_STATUS, { id: data.id, status: 'REJECTED' }, { root: true })
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const markAsSent = ({ commit, dispatch, state }, data) => {
  return new Promise((resolve, reject) => {
    window.axios.post(`/api/budgets/mark-as-sent`, data).then((response) => {
      commit(types.UPDATE_BUDGET_STATUS, {id: data.id, status: 'SENT'})
      commit('dashboard/' + dashboardTypes.UPDATE_BUDGET_STATUS, { id: data.id, status: 'SENT' }, { root: true })
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const convertToInvoice = ({ commit, dispatch, state }, id) => {
  return new Promise((resolve, reject) => {
    window.axios.post(`/api/budgets/${id}/convert-to-invoice`).then((response) => {
      // commit(types.UPDATE_INVOICE, response.data)
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const searchEstimate = ({ commit, dispatch, state }, data) => {
  return new Promise((resolve, reject) => {
    window.axios.get(`/api/budgets?${data}`).then((response) => {
      // commit(types.UPDATE_INVOICE, response.data)
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const selectEstimate = ({ commit, dispatch, state }, data) => {
  commit(types.SET_SELECTED_BUDGETS, data)
  if (state.selectedEstimates.length === state.budgets.length) {
    commit(types.SET_SELECT_ALL_STATE, true)
  } else {
    commit(types.SET_SELECT_ALL_STATE, false)
  }
}

export const setSelectAllState = ({ commit, dispatch, state }, data) => {
  commit(types.SET_SELECT_ALL_STATE, data)
}

export const selectAllEstimates = ({ commit, dispatch, state }) => {
  if (state.selectedEstimates.length === state.budgets.length) {
    commit(types.SET_SELECTED_BUDGETS, [])
    commit(types.SET_SELECT_ALL_STATE, false)
  } else {
    let allEstimateIds = state.budgets.map(estimt => estimt.id)
    commit(types.SET_SELECTED_BUDGETS, allEstimateIds)
    commit(types.SET_SELECT_ALL_STATE, true)
  }
}

export const resetSelectedEstimates = ({ commit, dispatch, state }) => {
  commit(types.RESET_SELECTED_BUDGETS)
}

export const setCustomer = ({ commit, dispatch, state }, data) => {
  commit(types.RESET_CUSTOMER)
  commit(types.SET_CUSTOMER, data)
}

export const setItem = ({ commit, dispatch, state }, data) => {
  commit(types.RESET_ITEM)
  commit(types.SET_ITEM, data)
}

export const resetCustomer = ({ commit, dispatch, state }) => {
  commit(types.RESET_CUSTOMER)
}

export const resetItem = ({ commit, dispatch, state }) => {
  commit(types.RESET_ITEM)
}

export const setTemplate = ({ commit, dispatch, state }, data) => {
  return new Promise((resolve, reject) => {
    commit(types.SET_TEMPLATE_ID, data)
    resolve({})
  })
}

export const selectCustomer = ({ commit, dispatch, state }, id) => {
  return new Promise((resolve, reject) => {
    window.axios.get(`/api/customers/${id}`).then((response) => {
      commit(types.RESET_SELECTED_CUSTOMER)
      commit(types.SELECT_CUSTOMER, response.data.customer)
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const resetSelectedCustomer = ({ commit, dispatch, state }, data) => {
  commit(types.RESET_SELECTED_CUSTOMER)
}
