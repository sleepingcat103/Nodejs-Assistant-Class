docker build -t michael-demo .
docker run --name="michael-demo" -v "{ypur path}":/data -p 3000:3000 -e ENV_PATH=/data/.env michael-demo