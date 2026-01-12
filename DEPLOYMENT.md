# Инструкция по развертыванию

## Требования

- Веб-сервер (Apache, Nginx или любой другой)
- PHP 7.4+ (для обработки форм, опционально)
- Node.js (для разработки, опционально)

## Шаги развертывания

### 1. Подготовка файлов

```bash
# Загрузите все файлы на сервер
scp -r * user@server:/var/www/autstaffing/
```

### 2. Настройка сервера

#### Apache (.htaccess)

Создайте файл `.htaccess` в корне проекта:

```apache
# Включение GZIP сжатия
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Кеширование
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Безопасность заголовков
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

#### Nginx

Добавьте в конфигурацию:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/autstaffing;
    index index.html;

    # GZIP
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Кеширование
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 3. SSL сертификат

```bash
# Let's Encrypt
sudo certbot --nginx -d yourdomain.com
```

### 4. Настройка домена

1. Укажите A-запись на IP сервера
2. Обновите `sitemap.xml` с правильным доменом
3. Обновите `robots.txt` с правильным доменом

### 5. Интеграция CRM

Отредактируйте `js/main.js`, функция `sendToCRM()`:

```javascript
async function sendToCRM(data) {
    // Пример для AmoCRM
    const response = await fetch('https://yourcrm.com/api/leads', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_API_TOKEN'
        },
        body: JSON.stringify({
            name: data.name,
            email: data.email,
            phone: data.phone,
            message: data.message
        })
    });
    
    return response.json();
}
```

### 6. Настройка аналитики

#### Яндекс.Метрика

Добавьте перед закрывающим тегом `</body>`:

```html
<!-- Yandex.Metrika counter -->
<script type="text/javascript">
   (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

   ym(YOUR_COUNTER_ID, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true
   });
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/YOUR_COUNTER_ID" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->
```

#### Google Analytics 4

Добавьте в `<head>`:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 7. Загрузка контента

1. Загрузите изображения в `assets/images/`
2. Загрузите видео в `assets/video/`
3. Загрузите документы в `assets/documents/`
4. Обновите контактную информацию в футере

### 8. Тестирование

Проверьте:
- [ ] Все секции отображаются корректно
- [ ] Калькулятор работает
- [ ] Формы отправляются
- [ ] Анимации работают плавно
- [ ] Адаптивность на мобильных
- [ ] Скорость загрузки (PageSpeed Insights)
- [ ] SSL сертификат работает

### 9. Резервное копирование

Настройте автоматическое резервное копирование:

```bash
# Пример скрипта backup.sh
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf /backup/autstaffing_$DATE.tar.gz /var/www/autstaffing
```

## Мониторинг

- Настройте UptimeRobot для мониторинга доступности
- Настройте Sentry для отслеживания ошибок JavaScript
- Настройте логирование ошибок на сервере

## Обновление контента

Для обновления контента можно:
1. Редактировать HTML напрямую
2. Использовать простую CMS (Strapi, Directus)
3. Интегрировать с существующей системой управления контентом