pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        skipDefaultCheckout(true)
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    environment {
        APP_NAME = 'locadora-rdt-frontend'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        NG_CLI_ANALYTICS = 'false'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            agent {
                docker {
                    image 'node:16-alpine'
                    reuseNode true
                }
            }
            steps {
                sh 'npm install --no-audit --no-fund'
            }
        }

        stage('Build Angular') {
            agent {
                docker {
                    image 'node:16-alpine'
                    reuseNode true
                }
            }
            steps {
                sh 'npm run build -- --configuration production'
            }
        }

        stage('Archive Dist') {
            steps {
                archiveArtifacts artifacts: 'dist/**', fingerprint: true
            }
        }

        stage('Prepare Docker Image') {
            steps {
                sh '''
                    docker build \
                      -t ${APP_NAME}:${IMAGE_TAG} \
                      -t ${APP_NAME}:latest \
                      .
                '''
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
