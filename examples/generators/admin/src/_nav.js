export default (i18n, admin) => [
  {
    icon: "mdi-view-dashboard",
    text: i18n.t("menu.dashboard"),
    link: "/",
  },
  { divider: true },
  admin.getResourceLink("users"),
  admin.getResourceLink("monsters"),
  admin.getResourceLink("monster_children"),
  admin.getResourceLink("books"),
];
