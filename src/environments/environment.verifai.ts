// const base_url: string = "http://prod.ivisecurity.com";
const base_url: string = "https://usstaging.ivisecurity.com";

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

    eventImageUrl: `${base_url}/dotimages/`,
    login_url: `${base_url}/userDetails`,
    site_url: `${base_url}/vipsites`,
    common_url: `${base_url}/metadata`,
    download_url: `${base_url}/common`,
    guard_monitoring_url: `${base_url}/guard_monitoring`,
    monitoring_url: `${base_url}/monitoring`,
    events_url: `https://stagingmq.ivisecurity.com/queueManagement`,
    event_tags_url: `${base_url}/events_data`,

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
