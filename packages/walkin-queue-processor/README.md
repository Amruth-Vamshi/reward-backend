# Walkin Queue processor Server

Repository for Queue processor

## Redis
```docker run -d -p 6379:6379 -v /home/walkin/redis/data:/data --name redis redis redis-server --appendonly yes```


## netstat for docker container
```docker run --rm --net container:graphql-redis nicolaka/netshoot netstat -ltn```
