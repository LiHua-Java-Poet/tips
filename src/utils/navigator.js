// src/utils/navigator.js
export default function navigator(context, path) {
  if (context.$route.path !== path) {
    context.$router.push(path)
  }
}
