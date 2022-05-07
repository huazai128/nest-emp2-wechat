#!/bin/bash
echo "====== build start ==========="

yarn add @nestjs/passport

yarn 

mkdir -p ./output
cp -rp ./node_modules ./output
cp -rp ./package.json ./output
cp -rp ./pm2.config.js ./output
# cp -rp ./prod.sh ./output

echo "step1: yarn build"

yarn build

echo "step2: yarn emp:build"
yarn emp:build

cp -rp ./dist ./output
cd output