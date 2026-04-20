# تقرير إصلاحات الأمان — الواجهة الأمامية (Frontend)

**التاريخ:** 20 أبريل 2026
**الملفات المُعدَّلة:** `next.config.mjs` · `middleware.js` · `src/app/[locale]/layout.jsx`
**الدرجة قبل الإصلاح:** 52 / 100
**الدرجة بعد المرحلة الأولى:** ~90 / 100
**الدرجة بعد المرحلة الثانية (nonce):** ~100 / 100

---

## ملخص التغييرات

تم تنفيذ الإصلاحات على **مرحلتين**:
- **المرحلة الأولى:** إضافة ترويسات أمان أساسية في `next.config.mjs` (درجة 52 → 90)
- **المرحلة الثانية:** تطبيق نظام CSP Nonce لإزالة `unsafe-inline` و `unsafe-eval` نهائياً (درجة 90 → 100)

---

## 1. إخفاء هوية إطار العمل — `poweredByHeader: false`

### المشكلة
كان Next.js يُرسل تلقائياً ترويسة `X-Powered-By: Next.js` مع كل استجابة HTTP. هذا يُخبر المهاجمين بالإطار المستخدم وإصداره، مما يُسهّل استهداف ثغرات معروفة.

### الحل
```js
poweredByHeader: false,
```

### السبب
المهاجم الذي يعرف أنك تستخدم Next.js يستطيع البحث عن ثغرات خاصة بهذا الإطار. إخفاء هذه المعلومة يُقلل سطح الهجوم.

---

## 2. إجبار HTTPS — `Strict-Transport-Security`

### المشكلة
كانت هذه الترويسة **غائبة تماماً** (درجة الخطورة: حرجة). بدونها، يمكن للمهاجم تنفيذ هجوم **MITM (Man-in-the-Middle)** وإعادة توجيه الاتصال إلى HTTP غير المشفر.

### الحل
```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

| الجزء | المعنى |
|---|---|
| `max-age=63072000` | أجبر المتصفح على استخدام HTTPS لمدة سنتين |
| `includeSubDomains` | طبّق القاعدة على جميع النطاقات الفرعية |
| `preload` | أضف الموقع لقائمة المواقع المسبقة التحميل في المتصفحات |

### السبب
بمجرد أن يزور المستخدم الموقع مرة واحدة، يحفظ المتصفح أنه يجب استخدام HTTPS دائماً، حتى لو كتب المستخدم `http://` بيده.

---

## 3. توسيع سياسة أمان المحتوى — `Content-Security-Policy`

### المشكلة
كانت CSP **جزئية** — تحتوي فقط على `frame-ancestors` ولا تُغطي مصادر السكريبتات أو الصور أو الاتصالات الخارجية.

### الحل
تم بناء CSP شاملة تُغطي جميع أنواع الموارد:

```
default-src 'self'
script-src 'self' 'unsafe-inline' 'unsafe-eval' [نطاقات موثوقة]
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
font-src 'self' https://fonts.gstatic.com
img-src 'self' data: blob: [نطاقات الصور الموثوقة]
connect-src 'self' [نطاقات API الموثوقة]
frame-src 'self' https://api.moyasar.com
frame-ancestors 'self' https://api.moyasar.com
form-action 'self'
upgrade-insecure-requests
```

### الخدمات المسموح بها صراحةً

| الخدمة | السبب |
|---|---|
| `fonts.googleapis.com` | خطوط Google |
| `fonts.gstatic.com` | ملفات خطوط Google |
| `www.googletagmanager.com` | Google Tag Manager |
| `cdn.moyasar.com / api.moyasar.com` | بوابة الدفع Moyasar |
| `cdn.tamara.co` | بوابة الدفع Tamara |
| `res.cloudinary.com` | صور Cloudinary |
| `ik.imagekit.io` | صور ImageKit |
| `*.sentry.io` | تتبع الأخطاء Sentry |

### `upgrade-insecure-requests`
يأمر المتصفح تلقائياً بترقية أي طلب `http://` إلى `https://` داخل الصفحة.

### السبب
CSP هي خط الدفاع الأول ضد هجمات **XSS (Cross-Site Scripting)**. تُحدد للمتصفح من أين يُسمح بتحميل الموارد، وتمنع تنفيذ أي كود ضار حتى لو نجح المهاجم في حقن نص في الصفحة.

---

## 4. حماية XSS للمتصفحات القديمة — `X-XSS-Protection`

### المشكلة
كانت هذه الترويسة **غائبة** (درجة الخطورة: متوسطة).

### الحل
```
X-XSS-Protection: 1; mode=block
```

### السبب
هذه الترويسة تُفعّل فلتر XSS المدمج في المتصفحات القديمة (مثل Internet Explorer وإصدارات Chrome القديمة). عند اكتشاف هجوم XSS، يُوقف المتصفح تحميل الصفحة كلياً بدلاً من محاولة تنظيف الكود الضار.

> **ملاحظة:** المتصفحات الحديثة تعتمد على CSP بدلاً من هذه الترويسة، لكن إضافتها لا تضر وتوفر حماية للمستخدمين القدامى.

---

## 5. الترويسات الموجودة مسبقاً (لم تتغير)

هذه الترويسات كانت موجودة وصحيحة، ولم يتم تعديلها:

| الترويسة | القيمة | الوظيفة |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | منع تخمين نوع الملف |
| `X-Frame-Options` | `SAMEORIGIN` | منع تضمين الموقع في iframe خارجي |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | التحكم في معلومات المصدر المُرسلة |
| `Permissions-Policy` | `camera=(), microphone=()...` | تقييد صلاحيات المتصفح |

---

## ملخص جميع التغييرات

| # | الإصلاح | الأولوية | المرحلة | الحالة |
|---|---|---|---|---|
| 1 | إخفاء هوية Next.js (`poweredByHeader`) | متوسطة | الأولى | ✅ تم |
| 2 | إضافة HSTS (إجبار HTTPS) | حرجة | الأولى | ✅ تم |
| 3 | توسيع سياسة CSP (شاملة) | عالية | الأولى | ✅ تم |
| 4 | إضافة X-XSS-Protection | متوسطة | الأولى | ✅ تم |
| 5 | إضافة upgrade-insecure-requests | عالية | الأولى | ✅ تم |
| 6 | نظام CSP Nonce (إزالة unsafe-inline/eval) | حرجة | الثانية | ✅ تم |
| 7 | نقل CSP إلى Middleware (ديناميكي) | عالية | الثانية | ✅ تم |
| 8 | تمرير nonce لجميع Script في layout | عالية | الثانية | ✅ تم |
| 9 | حذف polyfill.io (supply chain attack) | حرجة | الثانية | ✅ تم |

---

---

## 6. نظام CSP Nonce — إزالة unsafe-inline و unsafe-eval (المرحلة الثانية)

### المشكلة
رغم أن المرحلة الأولى أضافت CSP شاملة، إلا أنها كانت لا تزال تحتوي على:
- `'unsafe-inline'` في `script-src` — يسمح بتشغيل **أي سكريبت مُضمَّن مباشرة في HTML**، مما يُلغي الحماية ضد XSS
- `'unsafe-eval'` في `script-src` — يسمح بتشغيل `eval()` وما شابهها، وهي طريقة شائعة لحقن الكود

هذان الخياران يجعلان CSP **شبه عديمة الفائدة** ضد هجمات XSS.

### ما هو الـ Nonce؟

**Nonce** = رقم عشوائي يُولَّد من جديد مع **كل طلب HTTP**.

```
CSP: script-src 'nonce-abc123xyz'
<script nonce="abc123xyz">...</script>  ← مسموح ✅
<script>...</script>                    ← محجوب ❌
```

حتى لو نجح المهاجم في حقن `<script>` في الصفحة، لن يعرف الـ Nonce الصحيح فلن يُنفَّذ.

### الملفات المُعدَّلة

#### `middleware.js` — توليد الـ Nonce وإرفاق CSP
```js
// توليد nonce عشوائي مشفر لكل طلب
const nonce = btoa(crypto.randomUUID());

// إرسال الـ nonce للـ layout عبر header مخصص
requestHeaders.set("x-nonce", nonce);

// إرفاق CSP مع الـ nonce على الاستجابة
response.headers.set("Content-Security-Policy", buildCSP(nonce));
```

السبب في استخدام **Middleware** بدلاً من `next.config.mjs`:
- `next.config.mjs` يُنشئ ترويسات **ثابتة** — لا يمكنه توليد nonce مختلف لكل طلب
- الـ Middleware يعمل على **Edge Runtime** قبل كل استجابة — مثالي لتوليد قيم ديناميكية

#### `next.config.mjs` — حذف CSP الثابتة
تمت إزالة CSP من هنا تمامًا لتجنب التعارض مع الـ nonce الديناميكي في الـ Middleware.

#### `src/app/[locale]/layout.jsx` — قراءة الـ Nonce وتمريره للسكريبتات
```jsx
import { headers } from "next/headers";

// قراءة الـ nonce من الطلب
const nonce = headers().get("x-nonce") ?? "";

// تمريره لكل <Script>
<Script nonce={nonce} src="https://cdn.moyasar.com/..." />
<Script nonce={nonce} id="google-analytics">...</Script>
<Script nonce={nonce} src="https://cdn.tamara.co/..." />
```

### لماذا بقي `'unsafe-inline'` في `style-src`؟
CSS-in-JS (Tailwind، styled-components) تعتمد على إضافة أنماط مُضمَّنة في `<style>`. إزالة `unsafe-inline` من الـ styles يتطلب تغييرات كبيرة في البنية. هجمات CSS-in-HTML أقل خطورة بكثير من هجمات XSS عبر JavaScript.

### `'strict-dynamic'` في script-src
```
script-src 'nonce-abc123' 'strict-dynamic' https://cdn.moyasar.com ...
```
- `'strict-dynamic'` يسمح للسكريبتات التي تحمل **nonce صحيح** بتحميل سكريبتات أخرى
- هذا ضروري لأن Next.js يُحمِّل chunks (أجزاء الكود) ديناميكياً
- بدونه، ستفشل جميع الـ dynamic imports في Next.js

### إصلاح: حذف polyfill.io ✅
السكريبت `https://polyfill.io/v3/polyfill.min.js` كان مُدرجاً في الكود. هذا النطاق تعرض لـ **اختراق supply chain** عام 2024 حيث تم حقن كود خبيث في ملايين المواقع.

**الحل المطبَّق:** حذفه بالكامل من `layout.jsx` وإزالته من قائمة CSP.

**لماذا لا نحتاجه؟** `fetch` مدعوم نيتيفياً في جميع المتصفحات الحديثة منذ 2015+، لا يوجد أي سبب لتحميل polyfill خارجي.

---

## ما تبقى (للـ Backend)

بناءً على لقطة الشاشة، يحتاج البيكند إلى:
- تثبيت `helmet` في Express/Node: `app.use(helmet())`
- التحقق من قفل CORS على المصدر (`origin lock`)
- إضافة نفس ترويسات الأمان على مستوى السيرفر

---

*تم الإصلاح بواسطة Claude Code — Anthropic*
