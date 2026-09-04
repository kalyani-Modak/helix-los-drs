let _navigate = null;

export const setNavigate = (navigateFn) => {
  _navigate = navigateFn;
};

export const doNavigate = (to, options) => {
  if (_navigate) {
    _navigate(to, options);
  } else {
    console.warn("Navigate function not set yet!");
  }
};