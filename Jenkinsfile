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
                    sh 'npm install'
                  // sh 'npm test'
                }
            }

            stage('Build Docker Image') {
                when {
                    branch 'main'
                }
                steps {
                    script {
                    // Specify the path to the Dockerfile in the same directory
                    def dockerfilePath = './Dockerfile'

                    // Build the Docker image using the local Dockerfile
                    def dockerImage = docker.build("-f ${dockerfilePath} -t ${env.DOCKER_REGISTRY_URL}/nodejs-app:${env.BUILD_NUMBER} .")

                    // Push the Docker image to Docker Hub
                    docker.withRegistry('', 'docker-hub-credentials-id') {
                        dockerImage.push("${env.DOCKER_REGISTRY_URL}/nodejs-app:${env.BUILD_NUMBER}")
                    }
                    }
                }
            }

            stage('Deploy to EC2') {
                when {
                    branch 'main'
                }
                steps {
                    script {
                        sshagent(['your-ssh-credentials-id']) {
                            sh "ssh -o StrictHostKeyChecking=no ubuntu@107.22.23.176 'docker pull ${env.DOCKER_REGISTRY_URL}/nodejs-app:${env.BUILD_NUMBER}'"
                            sh "ssh -o StrictHostKeyChecking=no ubuntu@107.22.23.176 'docker stop nodejs-app || true'"
                            sh "ssh -o StrictHostKeyChecking=no ubuntu@107.22.23.176 'docker rm nodejs-app || true'"
                            sh "ssh -o StrictHostKeyChecking=no ubuntu@107.22.23.176 'docker run -d -p 80:80 --name nodejs-app ${env.DOCKER_REGISTRY_URL}/nodejs-app:${env.BUILD_NUMBER}'"
                        }
                    }
                }
            }
        }

        post {
            success {
                slackSend(
                    color: '#36a64f',
                    message: "Build ${env.BUILD_NUMBER} successful for ${env.JOB_NAME}"
                )
            }

            failure {
                slackSend(
                    color: '#FF5733',
                    message: "Build ${env.BUILD_NUMBER} failed for ${env.JOB_NAME}"
                )
            }
        }
    }
