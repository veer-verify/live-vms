const dev_url: string = "https://usstaging.ivisecurity.com";
const event_url: string = "https://stagingmq.ivisecurity.com";
// const localurl: string = "http://192.168.0.244:8234"
// const local = "http://192.168.0.244:8667"

export const environment = {
    env: 'ivis',
    // login_url: `${localurl}:3002/userDetails`,
    // site_url: `${localurl}:3004/vipsites`,
    // common_url: `${localurl}:8844/metadata`,
    // dot_analytics_url: `${localurl}:8952/dotAnalytics`,
    // events_url: `${localurl}:80`,
    // email_url: `${localurl}:8953/guard`,
    // guard_automation_url: `${localurl}:8089/guard_automation`,
    // guard_url:`${localurl}:8015/guardEmails`,
    // guard_monitoring_url:`${localurl}:3009/guard_monitoring`,
    // monitoring_url:`${localurl}:8016/monitoring`,
    // event_tags_url: `${localurl}:80/events_data`,
    // download_url: `${localurl}:80/common`,
    // eventImageUrl: `${localurl}:80/alert-images/`,


    login_url: `${dev_url}/userDetails`,
    site_url: `${dev_url}/vipsites`,
    common_url: `${dev_url}/metadata`,
    download_url: `${dev_url}/common`,
    guard_monitoring_url: `${dev_url}/guard_monitoring`,
    monitoring_url: `${dev_url}/monitoring`,
    event_tags_url: `${dev_url}/events_data`,
    eventImageUrl: `${dev_url}/dotimages/`,
    events_url: `https://stagingmq.uneeviu.com/queueManagement`,
    insightsUrl: `${dev_url}/insights`,
    adsUrl: `${dev_url}/proximityAdsMain`,
    faqUrl: `${dev_url}/faq`,
    genericUrl: `${dev_url}/supportRequests`,
    sensorUrl: `${dev_url}/sensors`,

    firstAlert: {
        time1: 1,
        time2: 2,
        time3: 3,
        time4: 4,
        time5: 5
    },

    kennedyAlert: {
        time1: 1,
        time2: 2,
        time3: 3,
        time4: 4,
        time5: 5
    },

    springAlert: {
        time1: 1,
        time2: 2,
        time3: 3,
        time4: 4,
        time5: 5
    },

    shopAlert: {
        time1: 1,
        time2: 2,
        time3: 3,
        time4: 4,
        time5: 5
    },

    oneWatchAlert: {
        time1: 0.5,
        time2: 1,
        time3: 2,
        time4: 3,
        time5: 4
    },
};
