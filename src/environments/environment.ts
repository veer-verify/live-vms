const prod_url: string = 'https://prod.ivisecurity.com';
// const dev_url: string = "http://usstaging.ivisecurity.com";

export const environment = {
  env: 'ivis',

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

  // login_url: `${prod_url}/userDetails_test`,
  // site_url: `${prod_url}/vipsites_test`,
  // common_url: `${prod_url}/metadata`,
  // download_url: `${prod_url}/common`,
  // guard_monitoring_url: `${prod_url}/guard_monitoring_test`,
  // monitoring_url: `${prod_url}/monitoring_test`,
  // events_url: `https://prodmq.ivisecurity.com/queueManagement_test`,
  // eventImageUrl: `${prod_url}/dotimages/`,
  // event_tags_url: `${prod_url}/events_data_test`,

  login_url: `${prod_url}/userDetails`,
  site_url: `${prod_url}/vipsites`,
  common_url: `${prod_url}/metadata`,
  download_url: `${prod_url}/common`,
  guard_monitoring_url: `${prod_url}/guard_monitoring`,
  monitoring_url: `${prod_url}/monitoring`,
  events_url: `https://prodmq.ivisecurity.com/queueManagement`,
  eventImageUrl: `${prod_url}/dotimages/`,
  event_tags_url: `${prod_url}/events_data`,
  insightsUrl: `${prod_url}/insights`,
  adsUrl: `${prod_url}/proximityAdsMain`,
  faqUrl: `${prod_url}/faq`,
  genericUrl: `${prod_url}/supportRequests`,
  sensorUrl: `${prod_url}/sensors`,

  firstAlert: {
    time1: 160,
    time2: 180,
    time3: 210,
    time4: 240,
    time5: 270,
  },

  kennedyAlert: {
    time1: 135,
    time2: 150,
    time3: 180,
    time4: 210,
    time5: 240,
  },

  oneWatchAlert: {
    time1: 0.5,
    time2: 150,
    time3: 180,
    time4: 210,
    time5: 240,
  },

  springAlert: {
    time1: 115,
    time2: 120,
    time3: 150,
    time4: 180,
    time5: 210,
  },

  shopAlert: {
    time1: 100,
    time2: 120,
    time3: 150,
    time4: 180,
    time5: 210,
  },
};
