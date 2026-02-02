import arcjet, { detectBot, shield, slidingWindow } from "@arcjet/node";

const aj = arcjet({
  key: process.env.ARCJET_KEY, 
  rules: [
   
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE", 
      allow: [
        "CATEGORY:SEARCH_ENGINE", 
        "CATEGORY:API_CLIENT",
      ],
    }),
  
    slidingWindow({
      mode: "LIVE",
      max: 100, 
      interval: 60, 
    }),
  ],
});

export default aj;