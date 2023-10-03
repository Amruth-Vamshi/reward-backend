#!/bin/sh

# google-chrome --headless --disable-gpu --remote-debugging-address=0.0.0.0 -remote-debugging-port=9222 --no-sandbox &
yarn start:prod &
sleep 120



cd packages/walkin-orderx/e2e_tests/

/usr/bin/java -jar karate-1.0.1.jar -p 9001 -m mocking/delivery-service.feature &
sleep 30

/usr/bin/java -jar -DuserName=dipak_is_testing@dipakji.com -Dpassword=Dipak@20peppo karate-1.0.1.jar tests/test-cases/*.feature -f junit:xml

export karate_status=$(echo $?)

cd 

DATE=$(date +%d_%m_%Y)

mkdir ~/.ssh

echo $KARATE_SSH | base64 -d > ~/.ssh/id_rsa

chmod 700 ~/.ssh && chmod 600 ~/.ssh/*

ssh -o 'StrictHostKeyChecking no'  root@143.110.188.182 'DATE=$(date +%d_%m_%Y) ; mkdir -p /var/www/html/orderx/$DATE'

scp -r -o 'StrictHostKeyChecking no'   /builds/WalkIn/walkin-server-monorepo/packages/walkin-orderx/e2e_tests/target/karate-reports/* root@143.110.188.182:/var/www/html/orderx/$DATE/

ssh -o 'StrictHostKeyChecking no'  root@143.110.188.182 'systemctl reload httpd.service'

return $karate_status
