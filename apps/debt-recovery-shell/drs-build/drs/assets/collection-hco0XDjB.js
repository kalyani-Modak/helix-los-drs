const collection = [
  {
    id: 1,
    description: "System Module",
    caption: "System",
    items: [
      {
        id: 101,
        description: "Learning module 101",
        caption: "Change Password"
      },
      {
        id: 102,
        description: "Learning module 102",
        caption: "Preferences",
        showFullOnly: true
      },
      {
        id: 103,
        description: "This is collection 3",
        caption: "Switch Profiles"
      },
      {
        id: 104,
        description: "This is collection 4",
        caption: "Announcement"
      }
    ]
  },
  {
    id: 2,
    description: "Security Module",
    caption: "Security",
    items: [
      {
        id: 3,
        description: "This is collection 3",
        caption: "Business Units",
        items: [
          {
            id: 4,
            description: "This is collection 4",
            caption: "Enable",
            showFullOnly: true
          },
          {
            id: 4,
            description: "This is collection 4",
            caption: "Disable",
            showFullOnly: true
          },
          {
            id: 4,
            description: "This is collection 4",
            caption: "New Business Unit"
          }
        ]
      },
      {
        id: 5,
        description: "Security Module",
        caption: "Details",
        items: [
          {
            id: 6,
            description: "This is collection 4",
            caption: "Information",
            showFullOnly: true
          },
          {
            id: 6,
            description: "This is collection 4",
            caption: "Working Hours",
            showFullOnly: true
          },
          {
            id: 6,
            description: "This is collection 4",
            caption: "Zip Code Ranges"
          }
        ]
      }
    ]
  }
];
export {
  collection as default
};
