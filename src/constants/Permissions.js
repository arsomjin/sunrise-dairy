export const PERMISSIONS = {
  granted: false,
  role: 'undefined',
  firstName: null,
  lastName: null,
  bucketNo: null,
  employeeNo: null,
  milk: {
    price: {
      view: true,
      edit: false,
    },
    QC: {
      add: false,
      view: true,
      edit: false,
    },
    report: {
      view: true,
    },
  },
  personal: {
    user: {
      edit: false,
      view: true,
    },
    employee: {
      edit: false,
      add: false,
      view: true,
    },
    member: {
      edit: false,
      add: false,
      view: true,
    },
  },
};
