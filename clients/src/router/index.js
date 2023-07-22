import { createRouter, createWebHistory } from "vue-router";
import Client from "@/views/Client.vue";

const routes = [
  {
    path: "/",
    name: "Client",
    component: Client,
  },
  {
    path: "/user",
    name: "User",
    component: () => import("@/views/User.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
