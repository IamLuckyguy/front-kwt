def previousVersion

pipeline {
    agent {
        kubernetes {
            yaml '''
                apiVersion: v1
                kind: Pod
                spec:
                  containers:
                  - name: kaniko
                    image: gcr.io/kaniko-project/executor:v1.23.2
                    command:
                    - /busybox/cat
                    tty: true
                    volumeMounts:
                    - name: jenkins-docker-cfg
                      mountPath: /kaniko/.docker
                  - name: kubectl
                    image: bitnami/kubectl:1.30.4
                    command:
                    - cat
                    tty: true
                  volumes:
                  - name: jenkins-docker-cfg
                    projected:
                      sources:
                      - secret:
                          name: docker-credentials
                          items:
                            - key: .dockerconfigjson
                              path: config.json
            '''
        }
    }
    parameters {
        string(name: 'IMAGE_TAG', defaultValue: '', description: '배포할 이미지 태그 (비워두면 최신 빌드 번호 사용)')
    }
    environment {
        DOCKER_IMAGE = "wondookong/front-kwt"
        DOCKER_TAG = "${params.IMAGE_TAG ?: env.BUILD_NUMBER}"
        K8S_NAMESPACE = "front-kwt"
        DEPLOYMENT_NAME = "front-kwt-deployment"
    }
    stages {
        stage('Get Previous Version') {
            steps {
                script {
                    try {
                        previousVersion = sh(
                            script: "kubectl get deployment ${env.DEPLOYMENT_NAME} -n ${env.K8S_NAMESPACE} -o=jsonpath='{.spec.template.spec.containers[0].image}'",
                            returnStdout: true
                        ).trim()
                        echo "Previous version: ${previousVersion}"
                    } catch (Exception e) {
                        echo "Failed to get previous version. This might be the first deployment."
                        previousVersion = null
                    }
                }
            }
        }
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build and Push with Kaniko') {
            steps {
                container('kaniko') {
                    script {
                        try {
                            sh """
                                /kaniko/executor --context `pwd` \
                                                 --dockerfile `pwd`/Dockerfile \
                                                 --destination ${env.DOCKER_IMAGE}:${env.DOCKER_TAG} \
                                                 --destination ${env.DOCKER_IMAGE}:latest
                            """
                        } catch (exc) {
                            error "Failed to build and push Docker image: ${exc.message}"
                        }
                    }
                }
            }
        }
        stage('Update Kubernetes manifests') {
            steps {
                script {
                    try {
                        sh "sed -i 's|${env.DOCKER_IMAGE}:.*|${env.DOCKER_IMAGE}:${env.DOCKER_TAG}|' k8s/deployment.yaml"
                    } catch (exc) {
                        error "Failed to update Kubernetes manifests: ${exc.message}"
                    }
                }
            }
        }
        stage('Create Namespace') {
            steps {
                container('kubectl') {
                    withKubeConfig([credentialsId: 'kubernetes-config']) {
                        script {
                            try {
                                sh "kubectl create namespace ${env.K8S_NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -"
                            } catch (exc) {
                                error "Failed to create namespace: ${exc.message}"
                            }
                        }
                    }
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                container('kubectl') {
                    withKubeConfig([credentialsId: 'kubernetes-config']) {
                        script {
                            try {
                                sh "kubectl apply -f k8s/deployment.yaml -n ${env.K8S_NAMESPACE}"
                                sh "kubectl apply -f k8s/service.yaml -n ${env.K8S_NAMESPACE}"
                                sh "kubectl rollout status deployment/${env.DEPLOYMENT_NAME} -n ${env.K8S_NAMESPACE} --timeout=300s"
                            } catch (Exception e) {
                                echo "Deployment failed: ${e.message}"
                                if (previousVersion) {
                                    echo "Rolling back to ${previousVersion}"
                                    sh "kubectl set image deployment/${env.DEPLOYMENT_NAME} ${env.DEPLOYMENT_NAME}=${previousVersion} -n ${env.K8S_NAMESPACE}"
                                    sh "kubectl rollout status deployment/${env.DEPLOYMENT_NAME} -n ${env.K8S_NAMESPACE} --timeout=300s"
                                } else {
                                    echo "No previous version available for rollback"
                                }
                                error "Deployment failed, check logs for details"
                            }
                        }
                    }
                }
            }
        }
    }
    post {
        always {
            script {
                // 작업 디렉토리 정리
                deleteDir()
            }
        }
        success {
            echo 'The Pipeline succeeded :)'
        }
        failure {
            // 실패시 알람 검토
            echo 'The Pipeline failed :('
        }
    }
}