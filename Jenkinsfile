pipeline {
    agent {
        docker { image 'cypress/browsers:node-20.9.0-chrome-118.0.5993.88-1-ff-118.0.2-edge-118.0.2088.46-1' } 
    }
    environment {
        HOME = "${env.WORKSPACE}"
    }

    options {
        ansiColor('xterm')
    }
    stages{
        stage("Initialization of dependencies") {
            steps {
                sh 'npm install'
            }
        }
        stage("Run tests") {
            parallel {
                stage("Run on Chrome") {
                    steps {
                        sh 'npm run cy:run:chrome'
                    }
                }
                stage("Run on Edge") {
                    steps {
                        sh 'npm run cy:run:edge'
                    }
                }
            }       
        }
    }
    post {
        always {
            sh 'npm run generate:report'        
            publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: true, reportDir: 'mochawesome-report', reportFiles: 'mochawesome.html', reportName: 'HTML Report', reportTitles: '', useWrapperFileDirectly: true])
            cleanWs()
        }
    }
}