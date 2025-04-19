@echo off
echo Installing Tailwind CSS and its dependencies...
cd /d "C:\laragon\www\projectYoucode_PROJET_FIL_ROUGE_A1_Promo_7\instrument-haven-frontend"

echo Removing existing node_modules folder...
rmdir /s /q node_modules

echo Removing package-lock.json...
del /f /q package-lock.json

echo Installing fresh dependencies...
npm install

echo Installing Tailwind CSS, PostCSS and Autoprefixer...
npm install -D tailwindcss postcss autoprefixer

echo Initializing Tailwind CSS (if needed)...
npx tailwindcss init -p

echo Done! Please start your development server with 'npm run dev'
pause
