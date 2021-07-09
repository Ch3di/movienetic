pipeline {
    agent { dockerfile true }
    environment {
        mv_jwtPrivateKey = credentials('movienetec-secret-key')
        mv_db = credentials('movienetec-db-uri')
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
    stage('build-run-container') {
      steps {
        script {
          def customImage = docker.build("movienetec:${env.BUILD_ID}")
          customImage.run("-e mv_jwtPrivateKey=$mv_jwtPrivateKey -e mv_db=$mv_db -p 3000:3000")
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
    // stage('Test') {
    //   steps {
    //     when {
    //       expression {
    //         BRANCH_NAME == 'dev'
    //       }
    //     }
    //     echo 'Testing...'
        
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
