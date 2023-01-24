export const PERMISSIONS = {
  granted: false,
  milk: {
    price: {
      view: true,
      edit: false,
    },
    QC: {
      add: true,
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
      add: true,
      view: true,
    },
    employee: {
      edit: false,
      add: true,
      view: true,
    },
    member: {
      edit: false,
      add: true,
      view: true,
    },
  },
};
