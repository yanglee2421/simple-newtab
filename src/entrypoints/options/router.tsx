import { createHashRouter, RouteObject, RouterProvider } from "react-router";
import { FullScreenProgress } from "@/components/FullScreenProgress";
import { RootRoute } from "./root";

const createRoutes = (): RouteObject[] => {
  return [
    {
      id: "root",
      path: ":lang?",
      Component: RootRoute,
      HydrateFallback: FullScreenProgress,
      loader: async () => {},
      children: [
        {
          index: true,
          lazy: () => import("./home"),
        },
        {
          path: "quotes",
          lazy: () => import("./quotes"),
        },
      ],
    },
  ];
};

const routes = createRoutes();
const router = createHashRouter(routes);

export const OptionsRouter = () => {
  return <RouterProvider router={router} />;
};
