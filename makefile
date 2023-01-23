.PHONY: start stop restart client server migrate fixtures install production run setup

start:
	docker-compose up --detach

stop:
	docker-compose down --remove-orphans --volumes --timeout 0

restart: stop start

install: start
	docker-compose exec node npm install

client:
	docker-compose exec node npm --workspace front run dev

server:
	docker-compose exec node npm --workspace back run development

migrate: start
	docker-compose exec node npm --workspace back run migrate

fixtures: migrate
	docker-compose exec node npm --workspace back run fixtures

setup: migrate fixtures

production: install
	docker-compose exec node npm --workspaces run production

run: production
	docker-compose exec node npm start