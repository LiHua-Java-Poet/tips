// src/utils/navigator.js
export function navigator(context, path) {
  if (context.$route.path !== path) {
    context.$router.push(path)
  }
}

export  function formatDate(timestamp) {
  const date = new Date(timestamp * 1000); // 转为毫秒
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}