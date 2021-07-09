pipeline {
  agent any
  environment {
    JWT_PRIVATE_KEY = credentials('movienetec-secret-key')
    DB_URI = credentials('movienetec-db-uri')
  }
  stages {
    stage('setup environment variables') {
      steps {
        sh "export mv_jwtPrivateKey=${JWT_PRIVATE_KEY}"
        sh "export mv_db=${DB_URI}"
        sh "export test=testing"
        sh "echo $test"
        sh "echo $mv_db"
      }
    }
    stage('Build') {
      steps {
        echo 'Building..'
        nodejs('nodejs-14.15.0') {
          sh 'npm install --also=dev'
        }
      }
    }
    stage('Test') {
      steps {
        when {
          expression {
            BRANCH_NAME == 'dev'
          }
        }
        echo 'Testing...'
        
      }
    }
    stage('Deploy') {
      steps {
        echo 'deploying..'
      }
    }
    stage('Run') {
      steps {
        echo 'deploying..'
        nodejs('nodejs-14.15.0') {
          sh 'npm start'
        }
      }
    }
    stage('show-log') {
      steps {
        echo 'printing logs..'
        sh 'cat logfile.log'
      }
    }
  }
}