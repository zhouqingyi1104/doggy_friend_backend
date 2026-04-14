#!/bin/sh

# 追加环境变量到 .env（保留构建时生成的 APP_KEY）
echo "" >> /var/www/laravel/.env
echo "APP_URL=${APP_URL}" >> /var/www/laravel/.env
echo "DB_USERNAME=${DB_USERNAME}" >> /var/www/laravel/.env
echo "DB_PASSWORD=${DB_PASSWORD}" >> /var/www/laravel/.env
echo "REDIS_PASSWORD=${REDIS_PASSWORD}" >> /var/www/laravel/.env
echo "WE_CHAT_APP_ID=${WE_CHAT_APP_ID}" >> /var/www/laravel/.env
echo "WE_CHAT_SECRET=${WE_CHAT_SECRET}" >> /var/www/laravel/.env
echo "QI_NIU_ACCESS_KEY=${QI_NIU_ACCESS_KEY}" >> /var/www/laravel/.env
echo "QI_NIU_SECRET_KEY=${QI_NIU_SECRET_KEY}" >> /var/www/laravel/.env
echo "BUCKET_NAME=${BUCKET_NAME}" >> /var/www/laravel/.env
echo "QI_NIU_DOMAIN=${QI_NIU_DOMAIN}" >> /var/www/laravel/.env
echo "YUN_PIAN_KEY=${YUN_PIAN_KEY}" >> /var/www/laravel/.env
echo "WECHAT_DOMAIN=${WECHAT_DOMAIN}" >> /var/www/laravel/.env
echo "ALI_ID=${ALI_ID}" >> /var/www/laravel/.env
echo "ALI_SECRET=${ALI_SECRET}" >> /var/www/laravel/.env
echo "SEND_CLOUD_API_USER=${SEND_CLOUD_API_USER}" >> /var/www/laravel/.env
echo "SEND_CLOUD_APP_KEY=${SEND_CLOUD_APP_KEY}" >> /var/www/laravel/.env

# 启动 PHP-FPM（后台运行）
php-fpm -D

# 启动 Nginx（前台运行，占据主进程）
nginx -g "daemon off;"
