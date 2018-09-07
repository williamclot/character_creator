all:
	sed -i "1s|^|var publicUrl = '${PUBLIC_URL}';\n|" public/js/skeleton.js