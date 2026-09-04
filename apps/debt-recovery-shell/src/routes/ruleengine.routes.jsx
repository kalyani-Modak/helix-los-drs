import React from "react";
import DMNEditor from "@ruleengine/DMNEditor";
import DMNBuilder from "@ruleengine/DMNBuilder";

const ruleengineRoutes = [
  {
    path: "/homelayout/ruleengine/editor",
    component: DMNEditor, 
  },
  {
    path: "/homelayout/ruleengine/builder",
    component: DMNBuilder,
  },
];

export default ruleengineRoutes;

