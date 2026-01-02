---
layout: post
title: Postgres for Rails Development
date: 2024-07-02
description: How I set up Postgres for Rails for local development
---

I've found that the best way to set up Posgres for local development is via Docker, since it has some
clear benefits over using system packages on Windows (via WSL2) or Linux.

There are three steps to configure Postgres for your Rails application:

1. Install the Postgres server
2. Install Postgres libraries for development
3. Configure your application to connect to the Postgres container

## Installing the Postgres container

After some testing, I've settled on the following command:

```bash
sudo docker run -d --restart unless-stopped \
  --name=postgres18 \
  -e POSTGRES_HOST_AUTH_METHOD=trust \
  -e POSTGRES_USER=$(whoami)\
  -p "127.0.0.1:5432:5432" \
  --shm-size=1g \
  postgres:18 -c max_locks_per_transaction=1024
```

Here's a short explanation of each flag:

- `sudo docker run -d` runs the Docker container in the background (-d means daemon)
- `--restart unless-stopped` will automatically start the Postgres service when the Docker daemon starts,
  unless manually stopped (which is very useful if you have a Postgre 17 instance, but you want to switch
  to Postgres 16 without changing the application configuration)
- `-e POSTGRES_HOST_AUTH_METHOD=trust` basically password authentication, which is fine for local development
  as long as the container is only exposed to the localhost (see below)
- `-e POSTGRES_USER=$(whoami)` sets the default user to your local OS system account (in my case it's `andrei`)
- `-p "127.0.0.1:5432:5432"` binds the internal port 5432 on the Docker container, which is used by Postgres,
  to the same port on localhost. Since the service binds to `127.0.0.1` this means that the port will not be
  accessible from the outside world (e.g. if you are using a shared wifi in a cafe)
- `--shm-size=1g` increases the default Docker container shared memory from 64MB to 1GB, otherwise Postgres
  might raise a "could not resize shared memory" error
- `-c "max_locks_per_transaction=128"` increases the number of locks per transaction, which can be reached
  by Rails when running tests (see [this Gitlab issue](https://gitlab.com/gitlab-org/gitlab/-/issues/412760#note_1426797584)).
  This needs to be last since it's passed as a command to `postgres`

## Install Postgres libraries for development

In order to connect to Postgres, we also need the development libraries so we can install the `pg` gem.
This is different on every system and Linux distribution, but on Ubuntu there is an official Apt repository
which offers access to the latest Postgres releases:

```bash
sudo apt install -y postgresql-common
sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh
```

Then install the latest client application (`createdb`, `dropdb`, `pg_dump`, `psql`, etc) and development
libraries:

```bash
sudo apt install postgresql-client-17 libpq-dev
```

You should be able to log into the database server now:

```shell
$ psql -h 127.0.0.1
psql (18.1 (Ubuntu 18.1-1.pgdg24.04+2))
Type "help" for help.

andrei=#
```

### Configure your application

We can simplify the `config/database.yml` file quite a lot when using Postgres. here's an example for
a blog application:

```yaml
default: &default
adapter: postgresql
encoding: unicode
# For details on connection pooling, see Rails configuration guide
# https://guides.rubyonrails.org/configuring.html#database-pooling
pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 3 } %>

development:
  <<: *default
  database: blog_development

# Warning: The database defined as "test" will be erased and
# re-generated from your development database when you run "rake".
# Do not set this db to the same as development or production.
test:
   <<: *default
  database: blog_test

# ActiveRecord will automatically use the `DATABASE_URL` environment
# variable for the primary database and `<NAME>_DATABASE_URL` for any
# secondary database (e.g. `REPLICA_DATABASE_URL`).
#
# If both database.yml and the environment variable contain the same values
# (e.g. host or database name), the environment variable wins.
production:
  <<: *default
  database: blog_production
```

Note that the host, username or password are all missing, which means that ActiveRecord will
connect by default to a socket on `localhost` and authenticate using the current system user.

In order to override that, we need to provide the following environment variables in your
local `.env` file or as part of `.bashrc`:

```bash
export PGHOST=127.0.0.1
```

In case you might be using a database schema different than `public` for your Rails application,
you can set that up using an environment variable as well:

```bash
export PGOPTIONS='-c search_path=myapp,public'
```

Now you should have Postgres ready for your Ruby on Rails application!
