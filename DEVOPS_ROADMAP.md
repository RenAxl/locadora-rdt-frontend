# Roadmap DevOps - Locadora RDT

Status atual: fases 1 a 5 concluidas.

## Fases

- [x] FASE 1 - Backend Docker
- [x] FASE 2 - Banco de Dados PostgreSQL Docker
- [x] FASE 3 - Frontend Docker
- [x] FASE 4 - Comunicacao entre Containers
- [x] FASE 5 - Docker Compose
- [ ] FASE 6 - Jenkins
- [ ] FASE 7 - SonarQube
- [ ] FASE 8 - Registry Local
- [ ] FASE 9 - Kubernetes kind ou Minikube

## Observacoes

- O frontend roda em container Docker na porta `4200`.
- O backend roda no container `locadora-rdt-backend` na porta `8080`.
- O PostgreSQL roda no container `locadora-rdt-postgres`.
- Frontend, backend e banco estao conectados pela rede Docker `locadora-rdt-network`.
- Para comunicacao interna entre containers, o backend deve ser acessado por `http://locadora-rdt-backend:8080`.
- O arquivo Compose central fica na pasta de infraestrutura: `locadora-rdt-devops/docker-compose.yml`.
