def previousVersion

pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  serviceAccountName: jenkins-sa
  containers:
    - name: jnlp
      image: jenkins/inbound-agent:3261.v9c670a_4748a_9-1
      resources:
        requests:
          memory: "512Mi"
          cpu: "500m"
        limits:
          memory: "1024Mi"
          cpu: "1000m"
    - name: kaniko
      image: gcr.io/kaniko-project/executor:debug
      imagePullPolicy: Always
      command:
        - /busybox/cat
      tty: true
      resources:
        requests:
          memory: "1024Mi"
          cpu: "1000m"
        limits:
          memory: "2048Mi"
          cpu: "1500m"
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
            podRetention(always())
        }
    }
    parameters {
        string(name: 'IMAGE_TAG', defaultValue: '', description: '배포할 이미지 태그 (비워두면 최신 빌드 번호 사용)')
    }
    environment {
        DOCKER_CONFIG = credentials('docker-hub-credentials')
        DOCKER_IMAGE = "wondookong/front-kwt"
        DOCKER_TAG = "${params.IMAGE_TAG ?: env.BUILD_NUMBER}"
        K8S_NAMESPACE = "front-kwt"
        DEPLOYMENT_NAME = "front-kwt-deployment"
    }
    stages {
        stage('Create Namespace and Deployment if not exists') {
            steps {
                container('kubectl') {
                    script {
                        // Check and create namespace if not exists
                        sh "kubectl get namespace ${env.K8S_NAMESPACE} || kubectl create namespace ${env.K8S_NAMESPACE}"

                        // Check if deployment exists
                        def deploymentExists = sh(script: "kubectl get deployment ${env.DEPLOYMENT_NAME} -n ${env.K8S_NAMESPACE}", returnStatus: true) == 0

                        if (!deploymentExists) {
                            echo "Deployment does not exist. Creating..."
                            sh """
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${env.DEPLOYMENT_NAME}
  namespace: ${env.K8S_NAMESPACE}
spec:
  replicas: 1
  selector:
    matchLabels:
      app: front-kwt
  template:
    metadata:
      labels:
        app: front-kwt
    spec:
      containers:
      - name: front-kwt
        image: wondookong/front-kwt:latest
        ports:
        - containerPort: 80
EOF
                    """
                        } else {
                            echo "Deployment ${env.DEPLOYMENT_NAME} already exists."
                        }
                    }
                }
            }
        }
        stage('Get Previous Version') {
            steps {
                container('kubectl') {
                    script {
                        echo "K8S_NAMESPACE: ${env.K8S_NAMESPACE}"
                        echo "DEPLOYMENT_NAME: ${env.DEPLOYMENT_NAME}"
                        try {
                            previousVersion = sh(
                                    script: "kubectl get deployment ${env.DEPLOYMENT_NAME} -n ${env.K8S_NAMESPACE} -o=jsonpath='{.spec.template.spec.containers[0].image}'",
                                    returnStdout: true
                            ).trim()
                            echo "Previous version: ${previousVersion}"
                        } catch (Exception e) {
                            echo "Error details: ${e.getMessage()}"
                            echo "Failed to get previous version. This might be the first deployment."
                            previousVersion = null
                        }
                    }
                }
            }
        }
        stage('Build and Push with Kaniko') {
            steps {
                echo "DOCKER_IMAGE: ${env.DOCKER_IMAGE}"
                echo "DOCKER_TAG: ${env.DOCKER_TAG}"
                container('kaniko') {
                    sh '/kaniko/executor --context `pwd` \
                             --destination ${env.DOCKER_IMAGE}:${env.DOCKER_TAG} \
                             --destination ${env.DOCKER_IMAGE}:latest \
                             --insecure \
                             --skip-tls-verify  \
                             --cleanup \
                             --dockerfile Dockerfile \
                             --verbosity debug'
                }
            }
        }
        stage('Update Kubernetes manifests') {
            steps {
                container('kubectl') {
                    script {
                        sh """
                    sed -i 's|image: .*|image: ${env.DOCKER_IMAGE}:${env.DOCKER_TAG}|' k8s/deployment.yaml
                """
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
                                error "Stage failed: ${STAGE_NAME}"
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
            echo "Pipeline execution completed"
        }
        success {
            echo 'The Pipeline succeeded :)'
        }
        aborted {
            echo "aborted Pipeline"
        }
        failure {
            echo "failure Pipeline :("
        }
    }
}