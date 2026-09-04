const COLLECTIONS = {
  menus: [
    {
      menuId: 2,
      name: "Allocation",
      path: "/homelayout/allocation",
      icon: "A"
    },
    {
      menuId: 3,
      name: "Followup",
      path: "/homelayout/allocation/:accountNumber",
      icon: "F"
    }
  ]
};
const USERMANAGEMENT = {
  menus: [
    {
      menuId: 1,
      name: "Products",
      path: "/homelayout/clients",
      icon: "P"
    },
    {
      menuId: 6,
      name: "Access Menu",
      path: "/homelayout/access",
      icon: "A"
    },
    {
      menuId: 4,
      name: "Users",
      path: "/homelayout/users",
      icon: "U"
    },
    {
      menuId: 5,
      name: "Data",
      path: "/homelayout/data",
      icon: "D"
    }
  ]
};
const modules = {
  COLLECTIONS,
  USERMANAGEMENT
};
export {
  COLLECTIONS,
  USERMANAGEMENT,
  modules as default
};
