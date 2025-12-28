export default function () {
  return process.env.NODE_ENV === 'production'
    ? 'https://andreimaxim.com'
    : 'http://localhost:8080';
}
