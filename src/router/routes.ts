export const routes = [
  {
    path: "/",
    component: () => import("@/layout/Layout.vue"),
    redirect: { name: "bookCity" },
    children: [
      {
        path: "bookCity",
        name: "bookCity",
        component: () => import("@/views/bookCity/BookCity.vue"),
        meta: {
          title: "书城",
          keepAlive: true,
          main: true
        }
      },
      {
        path: "bookSearch",
        name: "bookSearch",
        component: () => import("@/views/bookSearch/BookSearch.vue"),
        meta: {
          title: "搜索",
          keepAlive: true,
          main: true
        }
      },
      {
        path: "bookDetail",
        name: "bookDetail",
        component: () => import("@/views/bookDetail/BookDetail.vue"),
        meta: {
          title: "详情",
          keepAlive: true
        }
      },
      {
        path: "bookRead",
        name: "bookRead",
        component: () => import("@/views/bookRead/BookRead.vue"),
        meta: {
          title: "阅读"
        }
      }
    ]
  }
];
