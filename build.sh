echo restoring node packages...
npm install
echo restoring bower packages...
PATH=$PWD/node_modules/.bin:$PATH
export PATH
bower install
echo running grunt
grunt
