#!/groovy
// apptentive.*() functions tracked in github and imported as 'immutable-shared'
//   https://github.com/apptentive/jenkins-shared-libs/tree/master/vars
@Library('immutable-shared') _


pipeline {
  agent {
    kubernetes {
      yamlFile './_cri/KubernetesBuildPod.yaml'
    }
  }

  options {
    timeout(time: 10, unit: 'MINUTES')
  }

  stages {
    stage('Dev PR') {
      when {
        changeRequest target: 'dev'
        expression { env.ENVIRONMENT == 'dev' }
      }

      stages {
        stage('build'){
          steps {
            script {
              gitCommit = apptentiveGetReleaseCommit()
              imageName = apptentiveDockerBuild('run', gitCommit)
            }
          }
        }
      }

      stage('lint') {
        steps {
          script {
            container('docker') {
              sh "docker run ${imageName} npm run lint"
            }
          }
        }
      }
    }

    stage('deploy') {
      when {
        anyOf {
          // dev deploy
          allOf {
            anyOf {
              branch 'dev'
              changeRequest target: 'dev'
            }
            expression { env.ENVIRONMENT == 'dev' }
          }

          // staging/shared-dev deploy
          allOf {
            branch 'staging'
            expression { env.ENVIRONMENT == 'shared-dev' }
          }

          // Production deploy
          allOf {
            branch 'production'
            expression { env.ENVIRONMENT == 'production' }
          }
        }
      }

      steps {
        apptentiveDeployKubernetes()
      }
    }
  }
}
