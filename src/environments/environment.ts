const prod_url: string = "https://prod.ivisecurity.com";
const event_url: string = "https://stagingmq.ivisecurity.com";
const dev_url: string = "http://usstaging.ivisecurity.com";

export const environment = {

    // login_url: `${prod_url}:8543/userDetails`,
    // site_url: `${prod_url}:8943/vipsites`,
    // common_url: `${prod_url}:8844/metadata`,
    // event_url: `${prod_url}:80`,
    // dot_analytics_url: `${dev_url}:8952/dotAnalytics`,
    // email_url: `${dev_url}:8953/guard`,
    // guard_automation_url: `${dev_url}:8089/guard_automation`,
    // guard_url:`${dev_url}:8015/guardEmails`,
    // guard_monitoring_url:`${dev_url}:8015/guard_monitoring`,
    // monitoring_url:`${dev_url}:8016/monitoring`,

    login_url: `${prod_url}/userDetails`,
    site_url: `${prod_url}/vipsites`,
    common_url: `${prod_url}/metadata`,
    download_url: `${prod_url}/common`,
    guard_monitoring_url: `${prod_url}/guard_monitoring`,
    monitoring_url: `${prod_url}/monitoring`,
    // events_url: 'https://stagingmq.ivisecurity.com',
    events_url: `https://stagingmq.ivisecurity.com/queueManagement`,
    eventImageUrl: `${prod_url}/dotimages/`,
    event_tags_url: `${prod_url}/events_data`,

    firstAlert: {
        time1: 160,
        time2: 180,
        time3: 210,
        time4: 240,
        time5: 270
    },

    kennedyAlert: {
        time1: 135,
        time2: 150,
        time3: 180,
        time4: 210,
        time5: 240
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

    shopAlert: {
        time1: 100,
        time2: 120,
        time3: 150,
        time4: 180,
        time5: 210
    },

    API_TOKEN: 'OjykxjAFrVn6KqBcppQI2ptAt4Dpf0RyWE0eUINs7WyqWXLrtUKr3iS1LPRem0TY0UtU43H3S4rtt300',

    logo: 'assets/themes/logo.png',
    headerLogo: 'assets/themes/IVISsecurity_logo.png',
    activeLogo: 'assets/icons/eye-blue.svg',
    inActiveLogo: 'assets/icons/eye-red.svg',

    background_image: 'linear-gradient(325deg, rgba(20, 31, 77, 0.9) 18%, rgba(90, 13, 3, 0.9) 66%)',
    common_background: 'linear-gradient(160deg, #D44124, #104b86)',
    card_background: '#e6e8e8',
    loader_background: 'linear-gradient(90deg, rgba(28, 74, 130, 0.9) 0%, rgba(131, 96, 110, 0.9) 50%, rgba(208, 67, 41, 0.9) 100%)',
};
