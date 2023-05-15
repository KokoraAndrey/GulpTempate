# Сборка Gulp

### Об сборке 
В данной сборке используются следующие плагины: 
1. **autoprefixer** - выставление префиксов в css
2. **cssbeautify** - красивый код css
3. **strip-css-comments** - удаление коментариев css
4. **rename** - переименовывает файл 
5. **gulp-sass** - компилятор sass(scss) + sass gulp-sass
6. **cssnano** - сжимает сss файл (запятые, пробелы...)
7. **rigger** - склеивание js файлов
8. **uglify** - минификация js файлов
9. **plumber** - чтоб из-за ошибки не переставал работать gulp
10. **imagemin** - минификация картинок (сжатие и т.п.) !главное чтоб была версия 7.1.0. Чтобы откатится обратно npm i gulp-imagemin@7.1.0 -D
11. **del** - отчистка не нужных файлов. **!Нужна версия 6.0.0**
12. **panini** - удобная работа с html
13. **browser-sync** - локальный сервер
14. **gulp-babel** - перевод кода для старых браузеров

### Структура сборки
	src|
		assets|  
				js|
				scss|
				fonts|
				images|
		templates|
				data|
                		data.json
				layouts|
				    	default.html
				partials|
				    	head.html
		index.html

### Использование 
1. Для использования шаблона в проекте, необходимо скопировать следующие файлы: 
	- Папку src
	- gulpfile.js
	- package.json
2. После копирования файлов, нужно  провести инициализацию: 
	```
    npm i
    ```
3. Для начала работы с gulp, необходимо использовать команду: 
	``` 
    gulp
	```
