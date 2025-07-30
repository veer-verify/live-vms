const prod_url: string = "https://prod.ivisecurity.com";
// const prod_url: string = "http://rsmgmt.ivisecurity.com";
// const dev_url: string = "http://usstaging.ivisecurity.com";

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
    guard_monitoring_url:`${prod_url}/guard_monitoring`,
    monitoring_url:`${prod_url}/monitoring`,
    
    firstAlert: {
        time1: 160,
        time2: 180,
        time3: 210,
        time4: 240,
        time5: 270
    },
    
    newAlert: {
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
};
