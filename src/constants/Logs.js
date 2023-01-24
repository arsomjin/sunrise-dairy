export const LOG_ACTION = {
  add: 'ADD',
  edit: 'EDIT',
  delete: 'DELETE',
};
export const LOG_MODULE = {
  milk: {
    dailyQC: 'DAILY_QC',
    milkQC: 'MILK_QC',
    milkWeight: 'MILK_WEIGHT',
  },
  personal: {
    employees: 'EMPLOYEES',
    members: 'MEMBERS',
    userS: 'USERS',
  },
};
export const LOG_COMMAND = {
  milk: {
    dailyQC: {
      dailyQC_add: 'DAILY_QC_ADD',
      dailyQC_edit: 'DAILY_QC_EDIT',
      dailyQC_delete: 'DAILY_QC_DELETE',
    },
    milkQC: {
      milkQC_add: 'MILK_QC_ADD',
      milkQC_edit: 'MILK_QC_EDIT',
      milkQC_delete: 'MILK_QC_DELETE',
    },
    milkWeight: {
      milkWeight_import: 'MILK_WEIGHT_IMPORT',
      milkWeight_add: 'MILK_WEIGHT_ADD',
      milkWeight_edit: 'MILK_WEIGHT_EDIT',
      milkWeight_delete: 'MILK_WEIGHT_DELETE',
    },
  },
  personal: {
    employees: {
      employees_add: 'EMPLOYEES_ADD',
      employees_edit: 'EMPLOYEES_EDIT',
      employees_delete: 'EMPLOYEES_DELETE',
    },
    members: {
      members_add: 'MEMBERS_ADD',
      members_edit: 'MEMBERS_EDIT',
      members_delete: 'MEMBERS_DELETE',
    },
    users: {
      users_add: 'USERS_ADD',
      users_edit: 'USERS_EDIT',
      users_delete: 'USERS_DELETE',
    },
  },
};
