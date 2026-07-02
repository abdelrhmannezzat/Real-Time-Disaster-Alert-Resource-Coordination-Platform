export interface ApiPage<T> {
  content: T[];
  total?: number;
  page?: number;
  size?: number;
  pages?: number;
}