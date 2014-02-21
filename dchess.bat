@echo off
TASKKILL /IM node.exe /F /T
cd /
cd jscore\nodes\chessLine\chatNodeJSSocketIO-master
start /SEPARATE node --debug app.js
node-inspector &
