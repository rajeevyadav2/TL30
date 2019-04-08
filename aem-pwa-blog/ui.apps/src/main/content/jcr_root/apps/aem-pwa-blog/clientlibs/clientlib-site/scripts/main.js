/*
 *  Copyright 2018 Adobe Systems Incorporated
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

'use strict';

const pushButton = document.querySelector('.js-push-btn');

var config = {
    apiKey: "AIzaSyDSJsppoDjFCppABijYv5IXiEADtbdp_tM",
    authDomain: "aem-pwa-blog.firebaseapp.com",
    databaseURL: "https://aem-pwa-blog.firebaseio.com",
    projectId: "aem-pwa-blog",
    storageBucket: "aem-pwa-blog.appspot.com",
    messagingSenderId: "294077202000"
};
firebase.initializeApp(config);

var messaging = firebase.messaging();

var deferredPrompt;
var isSubscribed = false;
var swRegistration = null;

/**
 * Step zero : Make sure we have promise available to be used
 * service workers need extensively Promises.
 */
if (!window.Promise) {
    window.Promise = Promise;
}

/**
 * -----------------------------------------------------------------------
 * --
 * --                   Functions
 * --
 * -----------------------------------------------------------------------
 */

messaging.onMessage(function (payload) {
    console.log("[TL30-PWA][messaging] Message received. ", JSON.stringify(payload));
});
messaging.onTokenRefresh(function () {
    messaging.getToken()
        .then(function (refreshedToken) {
            console.log('Token refreshed : '+refreshedToken);
        }).catch(function (err) {
        console.log('Unable to retrieve refreshed token ', err);
    });
});

function initializeUI() {

    messaging.useServiceWorker(swRegistration);

    pushButton.addEventListener('click', function() {
        messaging
            .requestPermission()
            .then(function () {
                console.log("Got notification permission");
                return messaging.getToken();
            })
            .then(function (token) {
                // print the token on the HTML page
                console.log("Token", token);
            })
            .catch(function (err) {
                console.log("Didn't get notification permission", err);
            });
    });

}


/**
 * -----------------------------------------------------------------------
 * --
 * --                   Main
 * --
 * -----------------------------------------------------------------------
 */

/**
 * Step one: run a function on load (or whenever is appropriate for you)
 * Function run on load sets up the service worker if it is supported in the
 * browser. Requires a serviceworker in a `sw.js`. This file contains what will
 * happen when we receive a push notification.
 *
 */
if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('[TL30-PWA] >>>>> Service Worker and Push is supported');
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/content/aem-pwa-blog/sw.js',{ scope: '/content/aem-pwa-blog/en' })
            .then(function(registration) {
            // Registration was successful
            console.log('[TL30-PWA] >>>>> ServiceWorker registration successful with scope: ', registration.scope);
                swRegistration = registration;
                initializeUI();
        }, function(err) {
            // registration failed :(
            console.log('[TL30-PWA] >>>>> ServiceWorker registration failed: ', err);
        })
            // Intializing the notifications

    });
}else {
    console.warn('Service workers and Push messaging are not supported.');
}

/**
 * Step two: When the beforeinstallprompt event has fired,
 * save a reference to the event,and update your user interface
 * to indicate that the user can add your app to their home screen.
 *
 */
window.addEventListener('beforeinstallprompt', function(event) {
    console.log('[TL30-PWA] >>>>> beforeinstallprompt has been  fired !');
    event.preventDefault();
    deferredPrompt = event;
    return false;
});



