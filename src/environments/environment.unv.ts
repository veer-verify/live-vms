const base_url: string = 'https://staging.uneeviu.com';
// const base_url: string = 'https://usstaging.ivisecurity.com';

export const environment = {
  env: 'unv',
  eventImageUrl: `${base_url}/dotimages/`,
  login_url: `${base_url}/userDetails`,
  site_url: `${base_url}/vipsites`,
  common_url: `${base_url}/metadata`,
  download_url: `${base_url}/common`,
  guard_monitoring_url: `${base_url}/guard_monitoring`,
  monitoring_url: `${base_url}/monitoring`,
  events_url: `https://stagingmq.uneeviu.com/queueManagement`,
  event_tags_url: `${base_url}/events_data`,
    adsUrl: `${base_url}/proximityAdsMain`,
 faqUrl: `${base_url}/faq`,
  genericUrl: `${base_url}/supportRequests`,
  sensorUrl:`${base_url}/sensors`,


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
