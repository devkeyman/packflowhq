// url.ts (예시)
// 목적:
// - 로컬(local)에서는 백엔드(8080)를 직접 호출
// - 배포된 모든 환경(prod/stg/dev)은 동일하게 nginx 프록시(/api)로 호출
//   => HTTPS mixed content 방지 + 도메인 변경에도 안전

type Environment = "local" | "remote";

/**
 * local 판별만 정확하면 충분.
 * (prod/stg/dev 구분이 정말 필요하면 아래 주석의 확장 버전을 쓰면 됨)
 */
export const getEnvironment = (): Environment => {
  const hostname = window.location.hostname;
  return hostname === "localhost" || hostname === "127.0.0.1" ? "local" : "remote";
};

const API_PATH = "/api";

/**
 * API Base URL
 * - local: http://localhost:8080/api
 * - remote(운영/스테이징/개발 서버): /api  (현재 origin 기준, https 자동)
 */
export const getApiBaseUrl = (): string => {
  return getEnvironment() === "local" ? "http://localhost:8080/api" : API_PATH;
};

export const getApiPath = (): string => API_PATH;

export const currentEnvironment = getEnvironment();

/* ------------------------------------------------------------------
 * 만약 "stg/dev/prod" 구분이 로그/배너/기능토글 때문에 필요하면:
 *
 * type Environment2 = "prod" | "stg" | "dev" | "local";
 *
 * export const getEnvironment2 = (): Environment2 => {
 *   const h = window.location.hostname;
 *   if (h === "localhost" || h === "127.0.0.1") return "local";
 *   if (h === "s.packflowhq.com") return "stg";
 *   if (h === "d.packflowhq.com") return "dev";
 *   return "prod"; // packflowhq.com, www.packflowhq.com, 그 외는 prod 취급
 * };
 *
 * export const getApiBaseUrl2 = (): string => {
 *   return getEnvironment2() === "local" ? "http://localhost:8080/api" : "/api";
 * };
 * ------------------------------------------------------------------ */