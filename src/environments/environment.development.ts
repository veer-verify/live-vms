// const dev_url: string = "";
const dev_url: string = "https://usstaging.ivisecurity.com";
// const local_url: string = "";

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
    guard_monitoring_url:`${dev_url}/guard_monitoring`,
    monitoring_url:`${dev_url}/monitoring`,
    events_url: 'https://stagingmq.ivisecurity.com',

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
};
