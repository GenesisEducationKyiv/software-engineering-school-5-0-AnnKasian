const HTTP_DURATION_BUCKETS = [0.1, 0.5, 1, 2, 5, Infinity] as number[];
const DB_QUERY_DURATION_BUCKETS = [
  0.01,
  0.05,
  0.1,
  0.5,
  1,
  Infinity,
] as number[];

export { HTTP_DURATION_BUCKETS, DB_QUERY_DURATION_BUCKETS };
