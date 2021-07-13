pipeline {
    agent any
    environment {
        mv_jwtPrivateKey = credentials('movienetec-secret-key')
        mv_db = credentials('movienetec-db-uri')
        mv_db_testing = credentials('movienetec-db-test-uri')
        dockerRepo = "ch3di/movienetec"
    }
  stages {
    // stage('setup environment variables') {
    //   steps {
    //     sh "export mv_jwtPrivateKey=${JWT_PRIVATE_KEY}"
    //     sh "export mv_db=${DB_URI}"
    //     sh "export test=testing"
    //     sh "echo $test"
    //     sh "echo $mv_db"
    //   }
    // }


    stage('Test') {
      when {
        expression {
          env.BRANCH_NAME == 'dev'
        }
      }
      steps {
        sh "mv_db=$mv_db_testing"
        echo 'Testing...'
        nodejs('nodejs-14.15.0') {
          sh '''
            set +x
            npm install --also=dev
            npm run test
          '''
        }

      }
    }

    stage('build-container') {
      when {
        expression {
          env.BRANCH_NAME == 'master'
        }
      }
      steps {
        sh "docker build -t movienetec:${env.BUILD_ID} ."
      }
    }
    stage('run-container') {
      when {
        expression {
          env.BRANCH_NAME == 'master'
        }
      }
        steps {
            sh "docker run -d -p 3000:3000 -e mv_jwtPrivateKey=$mv_jwtPrivateKey -e mv_db=$mv_db movienetec:${env.BUILD_ID}"
        }
    }
    stage('push-container-to-docker-hub') {
      when {
        expression {
          env.BRANCH_NAME == 'master'
        }
      }
      steps {
        sh "docker tag movienetec:${env.BUILD_ID} $dockerRepo:${env.BUILD_ID}"
        withCredentials([usernamePassword(credentialsId: 'docker-hub', usernameVariable: 'USER', passwordVariable: 'PASSWORD')]) {
          sh "echo $PASSWORD | docker login -u $USER --password-stdin"
          sh "docker push $dockerRepo:${env.BUILD_ID}"
        }
      }
    }
    // stage('Build') {
    //   steps {
    //     echo 'Building..'
    //     nodejs('nodejs-14.15.0') {
    //       sh '''
    //         set +x
    //         npm install --also=dev
    //       '''
    //     }
    //   }
    // }


    stage('Deploy') {
      steps {
        echo 'deploying..'
      }
    }
    // stage('Run') {
    //   steps {
    //     echo 'running..'
    //     nodejs('nodejs-14.15.0') {
    //         sh '''
    //           set +x
    //           npm start
    //         '''
    //     }
    //   }
    // }
    // stage('show-log') {
    //   steps {
    //     echo 'printing logs..'
    //     sh '''
    //       set +x
    //       cat logfile.log
    //     '''
    //   }
    }
}
