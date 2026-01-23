const dev_url: string = "https://usstaging.ivisecurity.com";
const event_url: string = "https://stagingmq.ivisecurity.com";
// const localurl: string = "http://192.168.0.245"

const localurl: string = "http://localhost"

export const environment = {
    env: 'ivis',
    login_url: `${localurl}:3002/userDetails`,
    site_url: `${localurl}:3004/vipsites`,
    common_url: `${localurl}:8844/metadata`,
    dot_analytics_url: `${localurl}:8952/dotAnalytics`,
    events_url: `${localurl}:80`,
    email_url: `${localurl}:8953/guard`,
    guard_automation_url: `${localurl}:8089/guard_automation`,
    guard_url:`${localurl}:8015/guardEmails`,
    guard_monitoring_url:`${localurl}:3009/guard_monitoring`,
    monitoring_url:`${localurl}:8016/monitoring`,
    event_tags_url: `${localurl}:80/events_data`,
    download_url: `${localurl}:80/common`,
    eventImageUrl: `${localurl}:80/alert-images/`,



    //  login_url: `${localurl}/userDetails`,
    // site_url: `${localurl}/vipsites`,
    // common_url: `${localurl}/metadata`,
    // dot_analytics_url: `${localurl}/dotAnalytics`,
    // events_url: `${localurl}`,
    // email_url: `${localurl}/guard`,
    // guard_automation_url: `${localurl}/guard_automation`,
    // guard_url:`${localurl}/guardEmails`,
    // guard_monitoring_url:`${localurl}/guard_monitoring`,
    // monitoring_url:`${localurl}/monitoring`,
    // event_tags_url: `${localurl}/events_data`,
    // download_url: `${localurl}/common`,
    // eventImageUrl: `${local_url}/dotimages/`,



    // login_url: `${dev_url}/userDetails`,
    // site_url: `${dev_url}/vipsites`,
    // common_url: `${dev_url}/metadata`,
    // download_url: `${dev_url}/common`,
    // guard_monitoring_url: `${dev_url}/guard_monitoring`,
    // monitoring_url: `${dev_url}/monitoring`,
    // event_tags_url: `${dev_url}/events_data`,
    // eventImageUrl: `${dev_url}/dotimages/`,
    // events_url: `${event_url}/queueManagement`,

    firstAlert: {
        time1: 1,
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

    shopAlert: {
        time1: 100,
        time2: 120,
        time3: 150,
        time4: 180,
        time5: 210
    }
};
