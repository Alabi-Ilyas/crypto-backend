const i18next = require("i18next");
const Backend = require("i18next-fs-backend");
const middleware = require("i18next-http-middleware");

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "fr"], // replaces whitelist/preload
    preload: ["en", "fr"],
    backend: {
      loadPath: __dirname + "/locales/{{lng}}/{{ns}}.json",
    },
    detection: {
      order: ["querystring", "header"],
      caches: false,
    },
  });

module.exports = i18next;
