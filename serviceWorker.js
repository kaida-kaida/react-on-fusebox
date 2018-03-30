/* eslint no-console: off */
/* eslint consistent-return: off */
/* eslint no-return-assign: off */

const REQUEST_HEADERS = [
    'content-type',
    'X-Gal-Client',
    'X-Gal-User',
];
const INVALID_REQUESTS = [
    /sockjs-node/,
    /auth/,
];
const FETCH_CACHE_NAME = 'PWA_CACHE_TEST';
const filesToCache = [];

/**
 * @description キャッシュストレージにキャッシュを登録する
 * 初回遷移時にのみ実行される
 */
self.addEventListener('install', e => {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(FETCH_CACHE_NAME).then(cache => {
            console.log('[ServiceWorker] Caching app shell');
            console.log('[ServiceWorker] cacheName: ', FETCH_CACHE_NAME);
            return cache.addAll(filesToCache);
        }),
  );
});

/**
 * @description 古くなったキャッシュを全て削除する
 */
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => {
            const promises = [];
            keys.forEach(cacheName => {
                if (cacheName !== FETCH_CACHE_NAME) promises.push(caches.delete(cacheName));
            });
            return Promise.all(promises);
        }));
});

/**
 * [pushSubscription]
 * @description push通知を出すエンドポイントを返す
 *  PushSubcripionオブジェクトのuserVisibleOnlyプロパティがtrue
 * である場合のみ、エンドポイントを含み、エンドポイントがない場合、エラーを投げる
 * userVisibleOnlyはユーザがプッシュ通知を受け取ることができるかを示す
 * @param {Object} subscription  PushSubscription object
 * @return {String} subscription.endpoint  endpoint
 */
const pushSubscription = subscription => {
    console.log('[Service Worker]: ', subscription);
    if (subscription) return subscription.endpoint;
    throw new Error('User not subscribed');
};
/**
 * [asyncGetNotification]
 * @description push通知のタイトルとボディーを返す
 * notification.jsonに記述してあるオブジェクトを取得する
 * @return {Object} notification  Notification object contains title and body
 */
const asyncGetNotification = async () => {
    const res = await fetch('./notification.json');
    if (res.status !== 200) throw new Error('notification api respons error');
    const notification = await res.json();
    return notification;
};
/**
 * [notificationFire]
 * @description プッシュ通知イベントを発火する
 * @param {Object} self  Service worker object
 * @return {Object} notify  Push notification
 */
const notificationFire = self => ({ title, description }) => {
    const notify = self.registration.showNotification(
        title,
        {
            icon: '/images/notification/push.png',
            body: description,
        },
    );
    return notify;
};

/**
 * @description プッシュ通知を出す
 */
self.addEventListener('push', e => {
    e.waitUntil(
        self.registration.pushManager.getSubscription()
          .then(pushSubscription)
          .then(asyncGetNotification)
          .then(notificationFire(self)),
    );
});

const getRequestHeaders = headers => (
    REQUEST_HEADERS.reduce(
        (prev, next) => Object.assign(prev, { [next]: headers.get(next) }),
        {}
    )
);

const asyncFetcher = req => async cache => {
    let res = null;

    if (!/gpbs/.test(req.url)) res = await fetch(req.url);
    else {
        const REQUEST_OBJ = {
            headers: {
                ...getRequestHeaders(req.headers),
            },
            method: req.method,
            mode: req.mode,
        };
        res = await fetch(req.url, REQUEST_OBJ);
    }
    console.log('[ServiceWorker]: fetch ', res);
    if (res.ok) return cache.put(res.url, res);
    throw new Error(`[ServiceWorker]: Falied to fetch\n URL: ${res.url} \n response: ${JSON.stringify(res)}`);
};

const rejectSWFetchHock = url => INVALID_REQUESTS.some(reqExp => reqExp.test(url));

self.addEventListener('fetch', async e => {
    const req = e.request;
    if (rejectSWFetchHock(req.url)) {
        console.log('[Service Worker]: reject fetch', req.url);
        return e.waitUntil(
            caches.match(req).catch(() => fetch(req))
        );
        // e.respondWith(
        //     new Response('hello')
        // );
    }

    e.respondWith(
        caches.match(req).then(res => {
            if (res) {
                console.log('[ServiceWorker]: cached', res);
                return res;
            }
            console.log('[ServiseWorker]: noCacheRequest ', req);
            e.waitUntil(
            caches.open(FETCH_CACHE_NAME).then(asyncFetcher(req)));
            return fetch(req);
        }),
    );
});
