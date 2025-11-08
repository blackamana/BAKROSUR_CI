import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import { listPropertiesRoute } from "./routes/properties/list";
import { getPropertyRoute } from "./routes/properties/get";
import { createPropertyRoute } from "./routes/properties/create";
import { updatePropertyRoute } from "./routes/properties/update";
import { deletePropertyRoute } from "./routes/properties/delete";
import { uploadPropertyImageRoute } from "./routes/properties/upload-image";
import { meRoute } from "./routes/users/me";
import { listFavoritesRoute } from "./routes/favorites/list";
import { toggleFavoriteRoute } from "./routes/favorites/toggle";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  properties: createTRPCRouter({
    list: listPropertiesRoute,
    get: getPropertyRoute,
    create: createPropertyRoute,
    update: updatePropertyRoute,
    delete: deletePropertyRoute,
    uploadImage: uploadPropertyImageRoute,
  }),
  users: createTRPCRouter({
    me: meRoute,
  }),
  favorites: createTRPCRouter({
    list: listFavoritesRoute,
    toggle: toggleFavoriteRoute,
  }),
});

export type AppRouter = typeof appRouter;
