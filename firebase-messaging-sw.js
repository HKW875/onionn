// firebase-messaging-sw.js

importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyDMc-z5-FwlbWwDt_dWdbk82SLpm9GCE38",
  authDomain: "onionn-790da.firebaseapp.com",
  projectId: "onionn-790da",
  storageBucket: "onionn-790da.firebasestorage.app",
  messagingSenderId: "838790352647",
  appId: "1:838790352647:web:8d263b00650740b4157fa2"
});

const messaging = firebase.messaging();

// Background handler
messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icons/android-launchericon-192-192.png"
  });
});
