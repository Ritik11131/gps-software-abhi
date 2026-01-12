export const afsc = [
    {
        title: 'menu 1',
        iconClass: "finance-icon",
    },
    {
        title: 'Menu 2',
        iconClass: "finance-icon",

    },
    {
        title: 'Menu 3',
        iconClass: "quotes-icon",
    },
    {
        title: 'menu 4',
        iconClass: "finance-icon",
    },
    {
        title: 'Menu 5',
        iconClass: "finance-icon",

    },
    {
        title: 'Menu 6',
        iconClass: "quotes-icon",
    }
];

export const topHeader = [
    {
        title: 'dms',
        path: 'dms',
        type: 'dms',
        menu: [
            {
                title: 'Dashboard',
                iconClass: "finance-icon",
                sabMenu: [
                    {
                        title: 'ITMS Dashboard',
                        iconClass: "finance-icon",
                        img: '/assets/images/dashboard.png'
                    },
                    {
                        title: 'Shift Status',
                        iconClass: "finance-icon",
                        path: 'dashboard/shift-status',
                        img: '/assets/images/shift.png'
                    },
                    {
                        title: 'Complaint Dashborad',
                        iconClass: "finance-icon",
                        path: 'dashboard/complaint-dashboard',
                        img: '/assets/images/complaint.png'
                    }

                ]
            },
            {
                title: 'BOM',
                iconClass: "finance-icon",
            },
            {
                title: 'Registration',
                iconClass: "finance-icon",
                sabMenu: [
                    {
                        title: 'Staff Regisatration',
                        iconClass: "finance-icon",
                        path: 'registration/staff-registration'

                    },
                    {
                        title: 'Vehical registration ',
                        iconClass: "finance-icon",
                        path: 'registration/vehicle-registration'

                    },
                    {
                        title: 'Add Accident',
                        iconClass: "quotes-icon",
                        path: 'registration/add-accident'
                    },
                ]
            },
            {
                title: 'Management',
                iconClass: "quotes-icon",
                sabMenu: [
                    {
                        title: 'User management',
                        iconClass: "finance-icon",
                        sabMenuData: [
                            {
                                title: 'changed Password',
                                iconClass: "finance-icon",
                                path:'management/user-management/change-password'
                            },
                            {
                                title: 'On Road,off Road Vehicle',
                                iconClass: "finance-icon",
                                path:'management/user-management/off-road-vehicle'
                            },
                            {
                                title: 'User Role Access',
                                iconClass: "finance-icon",
                                path:'management/user-management/user-role-access'
                            },
                            {
                                title: 'User Roles',
                                iconClass: "finance-icon",
                                path:'management/user-management/user-roles'
                            },
                            {
                                title: 'User Vehicle Access',
                                iconClass: "finance-icon",
                                path:'management/user-management/user-vehicle-access'
                            },
                        ]

                    },
                    {
                        title: 'Battery  Management',
                        iconClass: "finance-icon",
                        sabMenuData: [
                            {
                                title: 'Battery maker',
                                iconClass: "finance-icon",
                                path:'management/battery-management/battery-maker'
                            },
                            {
                                title: 'Battery Master',
                                iconClass: "finance-icon",
                                path:'management/battery-management/battery-master'

                            },
                            {
                                title: 'Battery linking',
                                iconClass: "finance-icon",
                                path:'management/battery-management/battery-linking'
                            },
                            {
                                title: 'battery De-linking',
                                iconClass: "finance-icon",
                                path:'management/battery-management/battery-de-linking'
                            }
                        ]
                    },
                    {
                        title: 'Tyre Mangment',
                        iconClass: "quotes-icon",
                        sabMenuData: [
                            {
                                title: 'Damage Tyre',
                                iconClass: "finance-icon",
                                path:'management/tyre-management/damage-tyre'
                            },
                            {
                                title: 'Tyre Master',
                                iconClass: "finance-icon",
                                path:'management/tyre-management/tyre-master'
                            },
                            {
                                title: 'Tyre Linking',
                                iconClass: "finance-icon",
                                path:'management/tyre-management/tyre-linking'

                            },
                            {
                                title: 'Tyre De-linking',
                                iconClass: "finance-icon",
                                path:'management/tyre-management/tyre-de-linking'

                            },
                            {
                                title: 'Tyre NSD',
                                iconClass: "finance-icon",
                                path:'management/tyre-management/tyre-NSD'

                            },
                            {
                                title: 'Retread tyre send to vendor',
                                iconClass: "finance-icon",
                                path:'management/tyre-management/retread-tyre-send'

                            },
                            {
                                title: 'Retread tyre send to Received',
                                iconClass: "finance-icon",
                                path:'management/tyre-management/retread-tyre-received'

                            },
                            {
                                title: 'Report',
                                iconClass: "finance-icon",
                                path:'management/tyre-management/report'

                            }
                        ]
                    },
                    {
                        title: 'Driver Management',
                        iconClass: "finance-icon",
                        sabMenuData: [
                            {
                                title: 'Personal Information',
                                iconClass: "finance-icon",
                                path:'management/driver-management/personal-information'

                            },
                            {
                                title: 'Family Information',
                                iconClass: "finance-icon",
                                path:'management/driver-management/family-information'

                            },
                            {
                                title: 'Health Information',
                                iconClass: "finance-icon",
                                path:'management/driver-management/health-information'

                            },
                            {
                                title: 'Professional Information',
                                iconClass: "finance-icon",
                                path:'management/driver-management/professional-information'

                            },
                            {
                                title: 'Driver Leave Request',
                                iconClass: "finance-icon",
                                path:'management/driver-management/driver-leave-request'

                            },
                            {
                                title: 'Behaviour Information',
                                iconClass: "finance-icon",
                                path:'management/driver-management/behaviour-information'

                            },
                            {
                                title: 'Salary Information',
                                iconClass: "finance-icon",
                                path:'management/driver-management/salary-information'

                            },
                            {
                                title: 'Salary Report',
                                iconClass: "finance-icon",
                                path:'management/driver-management/salary-reports'

                            }
                        ]
                    },
                    {
                        title: 'Vechical Mangament',
                        iconClass: "finance-icon",
                        sabMenuData: [
                            {
                                title: 'Update RC Details',
                                iconClass: "finance-icon",
                                path:'management/vehicle-management/update-rc-details'

                            }
                        ]
                    },
                    {
                        title: 'Roaster Management',
                        iconClass: "finance-icon",
                        sabMenuData: [
                            {
                                title: 'Add Roster',
                                iconClass: "finance-icon",
                                path:'management/roaster-management/add-roster'

                            },
                            {
                                title: 'view roster',
                                iconClass: "finance-icon",
                                path:'management/roaster-management/view-roster'

                            },
                            {
                                title: 'Roster Attendance',
                                iconClass: "finance-icon",
                                path:'management/roaster-management/roster-attendance'

                            },
                            {
                                title: 'traffic management',
                                iconClass: "finance-icon",
                                path:'management/roaster-management/traffic-management'

                            }
                        ]
                    },
                    {
                        title: 'Employee Management',
                        iconClass: "finance-icon",
                        sabMenuData: [
                            {
                                title: 'Add Roster Staff',
                                iconClass: "finance-icon",
                                path:'management/employee-management/add-roster-staff'

                            },
                            {
                                title: 'View Staff Roster',
                                iconClass: "finance-icon",
                                path:'management/employee-management/view-staff-roster'

                            },
                            {
                                title: 'Manage Staff Attendance',
                                iconClass: "finance-icon",
                                path:'management/employee-management/manage-staff-attendance'

                            },
                            {
                                title: 'Attendance',
                                iconClass: "finance-icon",
                                path:'management/employee-management/attendance'

                            },
                            {
                                title: 'Show Attendance',
                                iconClass: "finance-icon",
                                path:'management/employee-management/show-attendance'

                            }
                        ]
                    },
                    {
                        title: 'Vendor Management',
                        iconClass: "finance-icon",
                        sabMenuData: [
                            {
                                title: 'Create vendor',
                                iconClass: "finance-icon",
                                path:'management/vendor-management/create-vendor'

                            }
                        ]
                    },
                    {
                        title: 'Incident Management',
                        iconClass: "finance-icon",
                    },
                    {
                        title: 'workshop management',
                        iconClass: "finance-icon",
                    },
                    {
                        title: 'Fuel Management',
                        iconClass: "finance-icon",
                    }
                ]
            },
            {
                title: 'Charging Station',
                iconClass: "finance-icon",
            },
            {
                title: 'Report',
                iconClass: "finance-icon",
                sabMenu: [
                    {
                        title: 'Infraction Report',
                        iconClass: "finance-icon",
                        path:'report/infractionm-report'


                    },
                    {
                        title: 'Complaint Report',
                        iconClass: "finance-icon",
                        path:'report/complaint-report'


                    },
                    {
                        title: 'Job Card Report',
                        iconClass: "quotes-icon",
                        path:'report/job-card-report'

                    },
                    {
                        title: 'Employee Report',
                        iconClass: "finance-icon",
                        path:'report/employee-report'

                    }
                ]
            },
        ]
    },
    {
        title: 'fms',
        path: 'fms',
        type: 'fms',
        menu: [
            {
                title: 'menu 1',
                iconClass: "finance-icon",
                sabMenu: [
                    {
                        title: 'menu 1',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'Menu 2',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'Menu 3',
                        iconClass: "quotes-icon",
                    },
                    {
                        title: 'menu 4',
                        iconClass: "finance-icon",
                    },
                    {
                        title: 'Menu 5',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'Menu 6',
                        iconClass: "quotes-icon",
                    }

                ]
            },
            {
                title: 'Menu 2',
                iconClass: "finance-icon",
                sabMenu: [
                    {
                        title: 'data 1',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'data 2',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'data 3',
                        iconClass: "quotes-icon",
                    },
                    {
                        title: 'data 4',
                        iconClass: "finance-icon",
                    },
                    {
                        title: 'data 5',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'data 6',
                        iconClass: "quotes-icon",
                    }

                ]
            },
            {
                title: 'Menu 3',
                iconClass: "quotes-icon",
                sabMenu: [
                    {
                        title: 'menu 1',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'Menu 2',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'Menu 3',
                        iconClass: "quotes-icon",
                    },
                    {
                        title: 'menu 4',
                        iconClass: "finance-icon",
                    },
                    {
                        title: 'Menu 5',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'Menu 6',
                        iconClass: "quotes-icon",
                    }

                ]
            },
            {
                title: 'menu 4',
                iconClass: "finance-icon",
                sabMenu: [
                    {
                        title: 'menu 1',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'Menu 2',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'Menu 3',
                        iconClass: "quotes-icon",
                    },
                    {
                        title: 'menu 4',
                        iconClass: "finance-icon",
                    },
                    {
                        title: 'Menu 5',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'Menu 6',
                        iconClass: "quotes-icon",
                    }

                ]
            },
            {
                title: 'Menu 5',
                iconClass: "finance-icon",
                sabMenu: [
                    {
                        title: 'menu 1',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'Menu 2',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'Menu 3',
                        iconClass: "quotes-icon",
                    },
                    {
                        title: 'menu 4',
                        iconClass: "finance-icon",
                    },
                    {
                        title: 'Menu 5',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'Menu 6',
                        iconClass: "quotes-icon",
                    }

                ]
            },
            {
                title: 'Menu 6',
                iconClass: "quotes-icon",
                sabMenu: [
                    {
                        title: 'menu 1',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'Menu 2',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'Menu 3',
                        iconClass: "quotes-icon",
                    },
                    {
                        title: 'menu 4',
                        iconClass: "finance-icon",
                    },
                    {
                        title: 'Menu 5',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'Menu 6',
                        iconClass: "quotes-icon",
                    }

                ]
            }

        ]
    },
    {
        title: 'ems',
        iconClass: "quotes-icon",
        path: 'ems',
        type: 'ems'
    },
    {
        title: 'pis',
        iconClass: "quotes-icon",
        path: 'pis',
        type: 'pis'
    },
    {
        title: 'afsc',
        path: 'afsc',
        type: 'afsc',
        menu: [
            {
                title: 'menu 1',
                iconClass: "finance-icon",
                sabMenu: [
                    {
                        title: 'menu 1',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'Menu 2',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'Menu 3',
                        iconClass: "quotes-icon",
                    },
                    {
                        title: 'menu 4',
                        iconClass: "finance-icon",
                    },
                    {
                        title: 'Menu 5',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'Menu 6',
                        iconClass: "quotes-icon",
                    }

                ]
            },
            {
                title: 'Menu 2',
                iconClass: "finance-icon",
                sabMenu: [
                    {
                        title: 'data 1',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'data 2',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'data 3',
                        iconClass: "quotes-icon",
                    },
                    {
                        title: 'data 4',
                        iconClass: "finance-icon",
                    },
                    {
                        title: 'data 5',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'data 6',
                        iconClass: "quotes-icon",
                    }

                ]
            },
            {
                title: 'Menu 3',
                iconClass: "quotes-icon",
                sabMenu: [
                    {
                        title: 'menu 1',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'Menu 2',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'Menu 3',
                        iconClass: "quotes-icon",
                    },
                    {
                        title: 'menu 4',
                        iconClass: "finance-icon",
                    },
                    {
                        title: 'Menu 5',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'Menu 6',
                        iconClass: "quotes-icon",
                    }

                ]
            },
            {
                title: 'menu 4',
                iconClass: "finance-icon",
                sabMenu: [
                    {
                        title: 'menu 1',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'Menu 2',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'Menu 3',
                        iconClass: "quotes-icon",
                    },
                    {
                        title: 'menu 4',
                        iconClass: "finance-icon",
                    },
                    {
                        title: 'Menu 5',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'Menu 6',
                        iconClass: "quotes-icon",
                    }

                ]
            },
            {
                title: 'Menu 5',
                iconClass: "finance-icon",
                sabMenu: [
                    {
                        title: 'menu 1',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'Menu 2',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'Menu 3',
                        iconClass: "quotes-icon",
                    },
                    {
                        title: 'menu 4',
                        iconClass: "finance-icon",
                    },
                    {
                        title: 'Menu 5',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'Menu 6',
                        iconClass: "quotes-icon",
                    }

                ]
            },
            {
                title: 'Menu 6',
                iconClass: "quotes-icon",
                sabMenu: [
                    {
                        title: 'menu 1',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'Menu 2',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'Menu 3',
                        iconClass: "quotes-icon",
                    },
                    {
                        title: 'menu 4',
                        iconClass: "finance-icon",
                    },
                    {
                        title: 'Menu 5',
                        iconClass: "finance-icon",

                    },
                    {
                        title: 'Menu 6',
                        iconClass: "quotes-icon",
                    }

                ]
            }

        ]
    },
]
