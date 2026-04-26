/** サーバー起動時に参照する基本設定をまとめるファイル。 */
export const PORT = Number(process.env.PORT ?? 3001);
export const STARTED_AT = new Date().toISOString();
