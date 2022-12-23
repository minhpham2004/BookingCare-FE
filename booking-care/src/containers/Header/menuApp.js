export const adminMenu = [
    { //user managing
        name: 'menu.admin.manage-user',
        menus: [
            {
                name: 'menu.admin.crud', link: '/system/user-manage'
            },
            {
                name: 'menu.admin.redux-crud', link: '/system/user-redux'
            },
            {
                name: 'menu.admin.manage-doctor', link: '/system/manage-doctor',
            },
            {
                name: 'menu.doctor.manage-schedule', link: '/doctor/manage-schedule'
            },
            // {
            //     name: 'menu.admin.manage-admin', link: '/system/user-admin',
            // },
        ]
    },
    ,
    { //clinic managing
        name: 'menu.admin.clinic',
        menus: [
            {
                name: 'menu.admin.manage-clinic', link: '/system/manage-clinic',
            }
        ]
    },

    { //specialty managing
        name: 'menu.admin.specialty',
        menus: [
            {
                name: 'menu.admin.manage-specialty', link: '/system/manage-specialty',
            },
        ]
    },

    { //handbook managing
        name: 'menu.admin.handbook',
        menus: [
            {
                name: 'menu.admin.manage-handbook', link: '/system/handbook',
            },
        ]
    },
];

export const doctorMenu = [
    {
        name: 'menu.admin.manage-user',
        menus: [
            { //doctor schedule managing
                name: 'menu.doctor.manage-schedule', link: '/doctor/manage-schedule'
            },
            { //doctor patient managing
                name: 'menu.doctor.manage-patient', link: '/doctor/manage-patient'
            },
        ]
    },
    {
        name: 'menu.doctor.to-homepage',
        menus: [
            { //doctor schedule managing
                name: 'menu.doctor.to-homepage', link: '/home'
            },
        ]
    },
];