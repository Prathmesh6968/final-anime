# समस्या निवारण गाइड (Troubleshooting Guide)

## समस्या: Anime Cards नहीं दिख रहे (Anime Cards Not Showing)

### कारण (Root Cause)
Supabase प्रोजेक्ट URL गलत है या प्रोजेक्ट मौजूद नहीं है।

**वर्तमान URL:** `https://qpfdiaqucqwooqbhfunu.supabase.co`
**स्थिति:** ❌ पहुंच योग्य नहीं (Not accessible)

### समाधान (Solution)

#### विकल्प 1: सही Supabase URL प्रदान करें
1. अपने Supabase Dashboard में जाएं: https://supabase.com/dashboard
2. अपना प्रोजेक्ट खोलें
3. Settings → API में जाएं
4. निम्नलिखित जानकारी कॉपी करें:
   - **Project URL** (जैसे: `https://xxxxx.supabase.co`)
   - **anon/public key**

5. `.env` फ़ाइल अपडेट करें:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### विकल्प 2: नया Supabase प्रोजेक्ट बनाएं
1. https://supabase.com पर जाएं
2. "New Project" पर क्लिक करें
3. प्रोजेक्ट का नाम दें (जैसे: "AnimeStream")
4. Database password सेट करें
5. Region चुनें (अपने location के करीब)
6. "Create new project" पर क्लिक करें
7. प्रोजेक्ट बनने का इंतजार करें (2-3 मिनट)
8. Settings → API से URL और Key कॉपी करें

#### विकल्प 3: पहले वाला Supabase प्रोजेक्ट इस्तेमाल करें
यदि आपके पास पहले से एक working Supabase प्रोजेक्ट है:

```bash
# .env फ़ाइल में अपडेट करें
VITE_SUPABASE_URL=https://pavyjfijdzseunfyitzm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Database Setup (नए प्रोजेक्ट के लिए)

यदि आप नया Supabase प्रोजेक्ट बना रहे हैं, तो निम्नलिखित SQL चलाएं:

1. Supabase Dashboard → SQL Editor में जाएं
2. `supabase/migrations/` फोल्डर में मौजूद migration files को चलाएं
3. या नीचे दिए गए SQL को चलाएं:

```sql
-- Tables create करें
CREATE TABLE anime_data (...);
CREATE TABLE episodes_data (...);
-- ... (पूरा schema)

-- Sample data insert करें
INSERT INTO anime_data (title, slug, ...) VALUES (...);
-- ... (sample anime data)
```

### त्वरित परीक्षण (Quick Test)

Terminal में चलाएं:
```bash
curl -I https://your-project.supabase.co
```

यदि आपको `200 OK` मिलता है, तो URL सही है। ✅
यदि `Could not resolve host` मिलता है, तो URL गलत है। ❌

### API Test

```bash
curl -H "apikey: your-anon-key" \
     -H "Authorization: Bearer your-anon-key" \
     https://your-project.supabase.co/rest/v1/anime_data
```

यदि आपको anime data मिलता है, तो सब कुछ काम कर रहा है! ✅

### अभी क्या करें (What to Do Now)

1. ✅ सही Supabase URL और Key प्राप्त करें
2. ✅ `.env` फ़ाइल अपडेट करें
3. ✅ Application को restart करें
4. ✅ Browser को refresh करें
5. ✅ Anime cards दिखने चाहिए!

### अतिरिक्त मदद (Additional Help)

यदि समस्या बनी रहती है:
1. Browser Console खोलें (F12)
2. Console tab में errors देखें
3. Network tab में API calls देखें
4. Error messages को ध्यान से पढ़ें

### सामान्य त्रुटियां (Common Errors)

**Error: "Could not resolve host"**
- समाधान: Supabase URL गलत है, सही URL प्रदान करें

**Error: "Invalid API key"**
- समाधान: ANON_KEY गलत है, सही key प्रदान करें

**Error: "relation does not exist"**
- समाधान: Database tables नहीं बनाए गए, migrations चलाएं

**Error: "permission denied"**
- समाधान: RLS policies गलत हैं, policies check करें

---

**नोट:** यह application पूरी तरह से काम कर रही है। बस सही Supabase credentials की जरूरत है!
