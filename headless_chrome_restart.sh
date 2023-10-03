#!/bin/sh

mkdir ~/.ssh

echo $KARATE_SSH | base64 -d > ~/.ssh/id_rsa

chmod 700 ~/.ssh && chmod 600 ~/.ssh/*

ssh -o 'StrictHostKeyChecking no'  root@142.93.223.210 'docker restart karate-chrome'

sleep 30