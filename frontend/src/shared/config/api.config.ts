type Environment = "prod" | "stg" | "dev" | "local";

const getEnvironment = (): Environment => {
  const hostname = window.location.hostname;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "local";
    // return "dev";
  } else if (
    hostname === "www.packflowhq.com" ||
    hostname === "packflowhq.com"
  ) {
    return "prod";
  } else if (hostname === "s.packflowhq.com") {
    return "stg";
  } else if (hostname === "d.packflowhq.com") {
    return "dev";
  }

  // 기본값
  return "dev";
};

const ROOT_URLS: Record<Environment, string> = {
  prod: "http://www.packflowhq.com",
  stg: "http://s.packflowhq.com",
  dev: "http://d.packflowhq.com",
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
