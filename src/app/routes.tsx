import { createBrowserRouter } from "react-router";
import { Home, NotFound } from "./Home";
import { ProjectDetail } from "./ProjectDetail";
import { About } from "./About";
import { Contact } from "./Contact";
import { Root } from "./Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "project/:id",
        Component: ProjectDetail,
      },
      {
        path: "about",
        Component: About,
      },
      {
        path: "contact",
        Component: Contact,
      },
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
]);
