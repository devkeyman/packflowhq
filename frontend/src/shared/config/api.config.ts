type Environment = "production" | "staging" | "development" | "local";

const getEnvironment = (): Environment => {
  const hostname = window.location.hostname;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "local";
    // return "development";
  } else if (
    hostname === "www.innopackage.com" ||
    hostname === "innopackage.com"
  ) {
    return "production";
  } else if (hostname === "s.innopackage.com") {
    return "staging";
  } else if (hostname === "d.innopackage.com") {
    return "development";
  }

  // 기본값
  return "development";
};

const ROOT_URLS: Record<Environment, string> = {
  production: "https://www.innopackage.com",
  staging: "https://s.innopackage.com",
  development: "http://d.innopackage.com",
  local: "http://localhost:8080",
};

const API_PATH = "/api";

export const getRootUrl = (): string => {
  const env = getEnvironment();
  return ROOT_URLS[env];
};

export const getApiBaseUrl = (): string => {
  return `${getRootUrl()}${API_PATH}`;
};

export const getApiPath = (): string => {
  return API_PATH;
};

export const currentEnvironment = getEnvironment();
