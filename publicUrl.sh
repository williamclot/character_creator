#Paths to public_html folder
HTLM='../mmf/public_html/character-creator'

#Inserting first line publicURL
sed -i "1s|^.*|var publicUrl = '$1';\n|g" build/js/skeleton.js
#Copying new files to the mmf folder
rm -r ../mmf/public_html/character-creator
cp -r build ../mmf/public_html/character-creator
