    pipeline {
        agent any
        environment {
            AWS_DEFAULT_REGION = 'us-east-1'
            DOCKER_REGISTRY_URL = 'docker.io/belwalrohit642'
        }

        stages {
            stage('Checkout') {
                steps {
                    checkout scm
                }
            }

            stage('Build and Test') {
                steps {
                    sh 'echo building and testing'
                  //  sh 'npm install'
                  // sh 'npm test'
                }
            }

   stage('Build and Push Docker Image') {
      environment {
        DOCKER_IMAGE = "belwalrohit642/nodejs-app:${BUILD_NUMBER}"
        // DOCKERFILE_LOCATION = "./Dockerfile"
        REGISTRY_CREDENTIALS = credentials('docker-hub-credentials-id')
      }
      steps {
        script {
            sh 'docker build -t ${DOCKER_IMAGE} .'
            def dockerImage = docker.image("${DOCKER_IMAGE}")
            docker.withRegistry('', "docker-hub-credentials-id") {
                dockerImage.push()
            }
        }
      }
    }
            stage('Deploy to EC2') {
             
                steps {
                    script {
                        echo "Connecting to EC2 instance..."
                        sshagent(credentials: ['your-ssh-credentials-id']) {
                            echo "Running commands on EC2 instance..."
                            sh "ssh -o StrictHostKeyChecking=no ubuntu@107.22.23.176 'docker pull ${env.DOCKER_REGISTRY_URL}/nodejs-app:${env.BUILD_NUMBER}'"
                            sh "ssh -o StrictHostKeyChecking=no ubuntu@107.22.23.176 'docker stop nodejs-app || true'"
                            sh "ssh -o StrictHostKeyChecking=no ubuntu@107.22.23.176 'docker rm nodejs-app || true'"
                            sh "ssh -o StrictHostKeyChecking=no ubuntu@107.22.23.176 'docker run -d -p 80:80 --name nodejs-app ${env.DOCKER_REGISTRY_URL}/nodejs-app:${env.BUILD_NUMBER}'"
                        }
                    }
                }
            }
        }
    }
