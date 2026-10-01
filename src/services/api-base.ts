/**
 * 统一的 API base 解析：
 * VITE_API_BASE（显式覆盖）> VITE_API_URL（旧/开发 proxy）> 按域名推导（多域名生产环境）
 *
 * 注意：所有直接 fetch 后端的服务（auth / gateway / AuthContext）都必须从这里取，
 * 不要在各自模块里写 fallback，否则生产构建（无 VITE 变量）会退化成 localhost。
 */

// 多域名生产环境映射：站点域名 → API 域名
const API_DOMAIN_MAP: Record<string, string> = {
    'syy.one': 'api.syy.one',
    'syy.global': 'api.syy.global',
    'syy.mobi': 'api.syy.mobi',
};

export function resolveApiBase(): string {
    if (typeof location === 'undefined') return 'http://localhost:8787';
    const hostname = location.hostname;
    for (const [suffix, apiDomain] of Object.entries(API_DOMAIN_MAP)) {
        if (hostname === suffix || hostname.endsWith(`.${suffix}`)) {
            return `https://${apiDomain}`;
        }
    }
    // 本地开发（localhost）等未映射域名：回退到 wrangler dev 默认端口
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8787';
    }
    return `https://api.${hostname}`;
}

export const API_BASE: string =
    import.meta.env.VITE_API_BASE ||
    import.meta.env.VITE_API_URL ||
    resolveApiBase();
