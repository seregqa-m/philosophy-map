process.chdir(__dirname);
// Portable output uses relative URLs and no service credentials or hosting bindings.
const fs=require('node:fs');
let html=fs.readFileSync('index.html','utf8');
html=html.replace(/<link rel="stylesheet" href="\.\/([^"]+)">/g,(_,f)=>'<style>'+fs.readFileSync(''+f.split('?')[0],'utf8')+'</style>');
html=html.replace(/<script src="\.\/([^"]+)"><\/script>/g,(_,f)=>'<script>'+fs.readFileSync(''+f.split('?')[0],'utf8').replace(/<\/script/gi,'<\\/script')+'</script>');
html=html.replace('href="./"','href="#main"').replace(/<a href="\.\/atlas-offline.html"[^>]*>[^<]*<\/a>/,'<p>Автономная копия · редакция с интерактивным графом</p>');
fs.writeFileSync('atlas-offline.html',html);
