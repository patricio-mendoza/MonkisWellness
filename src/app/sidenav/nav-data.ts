import { INavbarData } from "./helper";

export const navbarData: INavbarData[] = [
    {
        routeLink: "inicio",
        icon: "fal fa-home",
        label: "Inicio"
    },
    {
        routeLink: "reservaciones",
        icon: "fal fa-calendar-check",
        label: "Reservaciones",
        items: [
            {
                routeLink: "reservaciones",
                label: "Reservar"
            },
            {
                routeLink: "misreservas",
                label: "Mis Reservaciones"
            }
        ]
    },
    {
        routeLink: "avisos",
        icon: "fal fa-bell",
        label: "Avisos"
    },
];

export const navbarDataAdmin: INavbarData[] = [
    {
        routeLink: "inicio",
        icon: "fal fa-home",
        label: "Inicio"
    },
    {
        routeLink: "reservaciones",
        icon: "fal fa-calendar-check",
        label: "Reservaciones",
        items: [
            {
                routeLink: "reservaciones",
                label: "Reservar"
            },
            {
                routeLink: "misreservas",
                label: "Mis Reservaciones"
            }
        ]
    },
    {
        routeLink: "estadisticas",
        icon: "fal fa-chart-line",
        label: "Estadisticas"
    },
];