// const dev_url: string = "";
const dev_url: string = "https://usstaging.ivisecurity.com";
const event_url: string = "https://stagingmq.ivisecurity.com";
const local_url: string = "http://192.168.0.155:3009";

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




    login_url: `${dev_url}/userDetails`,
    site_url: `${dev_url}/vipsites`,
    common_url: `${dev_url}/metadata`,
    download_url: `${dev_url}/common`,
    guard_monitoring_url: `${dev_url}/guard_monitoring`,
    monitoring_url: `${dev_url}/monitoring`,
    event_tags_url: `${dev_url}/events_data`,
    eventImageUrl: `${dev_url}/dotimages/`,

    events_url: `${event_url}/queueManagement`,

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


    logo: 'assets/themes/logo.png',
    headerLogo: 'assets/themes/IVISsecurity_logo.png',
    accordianLogo: 'assets/icons/eye.svg',
    activeLogo: 'assets/icons/eye-blue.svg',
    inActiveLogo: 'assets/icons/eye-red.svg',

    background_image: 'linear-gradient(325deg, rgba(20, 31, 77, 0.9) 18%, rgba(90, 13, 3, 0.9) 66%)',
    common_background: 'linear-gradient(160deg, #D44124, #104b86)',
    card_background: '#e6e8e8',
    loader_background: 'linear-gradient(90deg, rgba(28, 74, 130, 0.9) 0%, rgba(131, 96, 110, 0.9) 50%, rgba(208, 67, 41, 0.9) 100%)',
};
