export const config = {
    developmentMode: true,
    webRoute : "./dist/web/",
    port: 3000,
    enableHttps : false,
    keyFile: "../keys/privkey.pem", // Only needed if enableHttps is true
    certFile: "../keys/fullchain.pem", // Only needed if enableHttps is true
    ollamaApiUrl: "http://192.168.178.208:11434",
    currentVersion: 0.1
};