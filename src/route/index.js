import { createRouter,createWebHashHistory} from "vue-router";
// const home = () => import("../views/home")
// const login = () => import("../views/login")
import home from '../views/home.vue'
// import login from '../views/login.vue'
import compare from '../views/compare.vue'


const routes = [
    { path: "/", redirect: "/home" },
    {
        path: "/home",
        name: "home",
        component: home
    },
    {
        path: "/compare",
        name: "compare",
        component: compare
    }
]


export const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})
