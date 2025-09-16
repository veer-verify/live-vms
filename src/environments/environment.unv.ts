const dev_url: string = "https://usstaging.ivisecurity.com";

export const environment = {

    // login_url: `${dev_url}:8922/userDetails`,
    // site_url: `${dev_url}:8943/vipsites`,
    // common_url: `${dev_url}:8844/metadata`,
    // dot_analytics_url: `${dev_url}:8952/dotAnalytics`,
    // event_url: `${dev_url}:80`,
    // email_url: `${dev_url}:8953/guard`,
    // guard_automation_url: `${dev_url}:8089/guard_automation`,
    // guard_url:`${dev_url}:8015/guardEmails`,
    // guard_monitoring_url:`${dev_url}:8015/guard_monitoring`,
    // monitoring_url:`${dev_url}:8016/monitoring`,

    eventImageUrl: 'https://usstaging.ivisecurity.com/dotimages/',
    login_url: `${dev_url}/userDetails`,
    site_url: `${dev_url}/vipsites`,
    common_url: `${dev_url}/metadata`,
    download_url: `${dev_url}/common`,
    guard_monitoring_url: `${dev_url}/guard_monitoring`,
    monitoring_url: `${dev_url}/monitoring`,
    // events_url: 'https://stagingmq.ivisecurity.com',
    events_url: 'https://stagingmq.ivisecurity.com/queueManagement',
    event_tags_url: `${dev_url}/events_data`,

    firstAlert: {
        time1: 0.5,
        time2: 2,
        time3: 3,
        time4: 4,
        time5: 5
    },

    kennedyAlert: {
        time1: 2,
        time2: 4,
        time3: 6,
        time4: 8,
        time5: 10
    },

    oneWatchAlert: {
        time1: 0.5,
        time2: 150,
        time3: 180,
        time4: 210,
        time5: 240
    },

    springAlert: {
        time1: 115,
        time2: 120,
        time3: 150,
        time4: 180,
        time5: 210
    },

    API_TOKEN: 'OjykxjAFrVn6KqBcppQI2ptAt4Dpf0RyWE0eUINs7WyqWXLrtUKr3iS1LPRem0TY0UtU43H3S4rtt300',

    logo: 'assets/images/UneeviuLogowhite (1).png',
    headerLogo: 'assets/themes/Uneeviu Logo Blue png.png',
    accordianLogo: 'assets/themes/CameraLogowhite.png',
    activeLogo: 'assets/themes/Uneeviu Logo Blue png.png',
    inActiveLogo: 'assets/themes/Uneeviu Logo Blue png.png',

    background_image: 'linear-gradient(325deg, #1E3F73 100%, #ffffff 0%)',
    common_background: 'linear-gradient(160deg, #1E3F73, #ffffff)',
    card_background: '#ffffff',
    loader_background: 'linear-gradient(325deg, #86a5d6, #1E3F73)',
};
