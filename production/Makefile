BUILD_NAME=dc-btp-web
BUILD_TAG=$$(git log -1 --pretty=%h)

build:
	@docker build -t ${BUILD_NAME}-backend:${BUILD_TAG} -t ${BUILD_NAME}-backend:latest -f backend/Dockerfile backend
	@docker build -t ${BUILD_NAME}-frontend:${BUILD_TAG} -t ${BUILD_NAME}-frontend:latest -f frontend/Dockerfile frontend

.env:
	@cp .env.example .env

launch: .env
	@docker compose up -d

build_launch:
	@docker compose up --build -d

scale_build_launch:
	@docker compose up --build -d --scale django=3 --scale postgresql=2

pull:
	@cd ..
	@git pull

deploy: pull stop build_launch

scale_deploy: pull scale_build_launch

scale-django:
	@docker compose scale django=3

scale-databases:
	@docker compose scale postgresql=2

scale: scale-django scale-databases

stop:
	@docker compose down

logs:
	@docker compose logs -f

ex-django:
	@docker exec -it $$(echo "$$(docker ps --filter "name=django")" | awk 'NR > 1 {print $$1}') sh

ex-vue:
	@docker exec -it $$(echo "$$(docker ps --filter "name=vue")" | awk 'NR > 1 {print $$1}') sh

ex-postgresql:
	@docker exec -it $$(echo "$$(docker ps --filter "name=postgresql")" | awk 'NR > 1 {print $$1}') sh