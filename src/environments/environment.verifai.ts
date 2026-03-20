// const base_url: string = "http://prod.ivisecurity.com";
const base_url: string = "https://usstaging.ivisecurity.com";
const localurl: string = "http://localhost";

export const environment = {
    env: 'verifai',

    // site_url: `${base_url}:3004/vipsites`,
    // guard_monitoring_url: `${base_url}:3009/guard_monitoring`,
    // monitoring_url: `${base_url}:8016/monitoring`,

    // event_tags_url: `${base_url}:0000/events_data`,
    // events_url: `http://stagingmq.ivisecurity.com:0000/queueManagement`,
    // eventImageUrl: `${base_url}:0000/dotimages/`,
    // download_url: `${base_url}:3001/common`,

    // login_url: `${base_url}:3002/userDetails`,
    // common_url: `${base_url}:3005`,
    // metadataUrl: `${base_url}:3005/metadata`,
    // sitesUrl: `${base_url}:3004`,
    // incidentsUrl: `${base_url}:8945`,

    //   login_url: `${localurl}:3002/userDetails`,
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
    //  insightsUrl: `${localurl}/insights`,

    eventImageUrl: `${base_url}/dotimages/`,
    login_url: `${base_url}/userDetails`,
    site_url: `${base_url}/vipsites`,
    common_url: `${base_url}/metadata`,
    download_url: `${base_url}/common`,
    guard_monitoring_url: `${base_url}/guard_monitoring`,
    monitoring_url: `${base_url}/monitoring`,
    events_url: `https://stagingmq.ivisecurity.com/queueManagement`,
    event_tags_url: `${base_url}/events_data`,
        insightsUrl: `${base_url}/insights`,
          adsUrl: `${base_url}/proximityAdsMain`,
 faqUrl: `${base_url}/faq`,
   genericUrl: `${base_url}/supportRequests`,
     sensorUrl:`${base_url}/sensors`,


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
    }
};
