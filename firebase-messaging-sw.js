// firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/11.4.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.4.0/firebase-messaging-compat.js');

firebase.initializeApp({
  messagingSenderId: '838790352647'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const title = payload.notification?.title || 'Onionn';
  const options = {
    body: payload.notification?.body,
    icon: '/icons/android-launchericon-192-192.png',
  };
  self.registration.showNotification(title, options);
});
