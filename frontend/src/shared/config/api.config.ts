type Environment = "prod" | "stg" | "dev" | "local";

const getEnvironment = (): Environment => {
  const hostname = window.location.hostname;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "local";
    // return "dev";
  } else if (
    hostname === "www.innopackage.com" ||
    hostname === "innopackage.com"
  ) {
    return "prod";
  } else if (hostname === "s.innopackage.com") {
    return "stg";
  } else if (hostname === "d.innopackage.com") {
    return "dev";
  }

  // 기본값
  return "dev";
};

const ROOT_URLS: Record<Environment, string> = {
  prod: "http://www.innopackage.com",
  stg: "http://s.innopackage.com",
  dev: "http://d.innopackage.com",
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
